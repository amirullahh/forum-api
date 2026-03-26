import { describe, it, expect, afterEach, afterAll } from 'vitest';
import pool from '../../database/postgres/pool.js';
import CommentLikesTableTestHelper from '../../../../tests/CommentLikesTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import CommentLikeRepositoryPostgres from '../CommentLikeRepositoryPostgres.js';

describe('CommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('toggleLike function', () => {
    it('should add like when user has not liked the comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const fakeIdGenerator = () => '123';
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentLikeRepository.toggleLike('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper.findLikeByCommentAndUser('comment-123', 'user-123');
      expect(likes).toHaveLength(1);
      expect(likes[0].id).toBe('like-123');
    });

    it('should remove like when user has already liked the comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', userId: 'user-123' });

      const fakeIdGenerator = () => '123';
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentLikeRepository.toggleLike('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper.findLikeByCommentAndUser('comment-123', 'user-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('should return correct like count', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'user456' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', userId: 'user-123' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-456', commentId: 'comment-123', userId: 'user-456' });

      const fakeIdGenerator = () => '123';
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const count = await commentLikeRepository.getLikeCountByCommentId('comment-123');

      // Assert
      expect(count).toBe(2);
    });

    it('should return 0 when comment has no likes', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const fakeIdGenerator = () => '123';
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const count = await commentLikeRepository.getLikeCountByCommentId('comment-123');

      // Assert
      expect(count).toBe(0);
    });
  });

  describe('getLikeCountsByCommentIds function', () => {
    it('should return correct like counts for multiple comments', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'user456' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-456', threadId: 'thread-123', owner: 'user-123' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', userId: 'user-123' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-456', commentId: 'comment-123', userId: 'user-456' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-789', commentId: 'comment-456', userId: 'user-123' });

      const fakeIdGenerator = () => '123';
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const counts = await commentLikeRepository.getLikeCountsByCommentIds(['comment-123', 'comment-456']);

      // Assert
      expect(counts).toEqual({
        'comment-123': 2,
        'comment-456': 1,
      });
    });

    it('should return empty object when given empty array', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const counts = await commentLikeRepository.getLikeCountsByCommentIds([]);

      // Assert
      expect(counts).toEqual({});
    });
  });
});
