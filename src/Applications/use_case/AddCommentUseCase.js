import AddComment from '../../Domains/comments/entities/AddComment.js';

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddComment(useCasePayload);

    // Verify thread exists
    await this._threadRepository.verifyThreadExists(addComment.threadId);

    return this._commentRepository.addComment(addComment);
  }
}

export default AddCommentUseCase;
