import ThreadDetail from '../../Domains/threads/entities/ThreadDetail.js';

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    // Verify thread exists
    await this._threadRepository.verifyThreadExists(threadId);

    // Get thread data
    const thread = await this._threadRepository.getThreadById(threadId);

    // Get comments for this thread
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    // Get like counts for all comments
    const commentIds = comments.map((comment) => comment.id);
    const likeCounts = await this._commentLikeRepository.getLikeCountsByCommentIds(commentIds);

    // Format comments (handle soft delete) and add replies
    const formattedComments = await Promise.all(
      comments.map(async (comment) => {
        // Get replies for this comment
        const replies = await this._replyRepository.getRepliesByCommentId(comment.id);

        // Format replies (handle soft delete and date)
        const formattedReplies = replies.map((reply) => ({
          id: reply.id,
          content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
          date: reply.date instanceof Date ? reply.date.toISOString() : reply.date,
          username: reply.username,
        }));

        return {
          id: comment.id,
          username: comment.username,
          date: comment.date instanceof Date ? comment.date.toISOString() : comment.date,
          replies: formattedReplies,
          content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
          likeCount: likeCounts[comment.id] || 0,
        };
      })
    );

    // Return thread detail with comments and replies
    return new ThreadDetail({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date instanceof Date ? thread.date.toISOString() : thread.date,
      username: thread.username,
      comments: formattedComments,
    });
  }
}

export default GetThreadDetailUseCase;
