import CommentLikeRepository from '../../Domains/comment_likes/CommentLikeRepository.js';

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async toggleLike(commentId, userId) {
    // Check if user already liked this comment
    const checkQuery = {
      text: 'SELECT id FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const checkResult = await this._pool.query(checkQuery);

    if (checkResult.rowCount > 0) {
      // User already liked, so unlike (delete)
      const deleteQuery = {
        text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
        values: [commentId, userId],
      };

      await this._pool.query(deleteQuery);
    } else {
      // User hasn't liked, so like (insert)
      const id = `like-${this._idGenerator()}`;
      const insertQuery = {
        text: 'INSERT INTO comment_likes(id, comment_id, user_id) VALUES($1, $2, $3)',
        values: [id, commentId, userId],
      };

      await this._pool.query(insertQuery);
    }
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*)::int as count FROM comment_likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].count;
  }

  async getLikeCountsByCommentIds(commentIds) {
    if (commentIds.length === 0) {
      return {};
    }

    const query = {
      text: 'SELECT comment_id, COUNT(*)::int as count FROM comment_likes WHERE comment_id = ANY($1) GROUP BY comment_id',
      values: [commentIds],
    };

    const result = await this._pool.query(query);

    // Convert to object with comment_id as key
    const likeCounts = {};
    result.rows.forEach((row) => {
      likeCounts[row.comment_id] = row.count;
    });

    return likeCounts;
  }
}

export default CommentLikeRepositoryPostgres;
