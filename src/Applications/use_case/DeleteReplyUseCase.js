class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, replyId, owner } = useCasePayload;

    // Verify thread exists
    await this._threadRepository.verifyThreadExists(threadId);

    // Verify comment exists on thread
    await this._commentRepository.verifyCommentExistsOnThread(commentId, threadId);

    // Verify reply exists on comment
    await this._replyRepository.verifyReplyExistsOnComment(replyId, commentId);

    // Verify reply owner
    await this._replyRepository.verifyReplyOwner(replyId, owner);

    // Delete reply (soft delete)
    await this._replyRepository.deleteReply(replyId);
  }
}

export default DeleteReplyUseCase;
