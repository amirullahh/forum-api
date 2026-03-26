class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;

    // Verify thread exists
    await this._threadRepository.verifyThreadExists(threadId);

    // Verify comment exists on thread
    await this._commentRepository.verifyCommentExistsOnThread(commentId, threadId);

    // Verify comment owner
    await this._commentRepository.verifyCommentOwner(commentId, owner);

    // Delete comment (soft delete)
    await this._commentRepository.deleteComment(commentId);
  }
}

export default DeleteCommentUseCase;
