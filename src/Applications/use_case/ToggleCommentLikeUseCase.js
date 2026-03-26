class ToggleCommentLikeUseCase {
  constructor({ threadRepository, commentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, userId } = useCasePayload;

    // Verify thread exists
    await this._threadRepository.verifyThreadExists(threadId);

    // Verify comment exists on this thread
    await this._commentRepository.verifyCommentExistsOnThread(commentId, threadId);

    // Toggle like
    await this._commentLikeRepository.toggleLike(commentId, userId);
  }
}

export default ToggleCommentLikeUseCase;
