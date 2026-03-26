import AddReply from '../../Domains/replies/entities/AddReply.js';

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);

    // Verify thread exists
    await this._threadRepository.verifyThreadExists(useCasePayload.threadId);

    // Verify comment exists on thread
    await this._commentRepository.verifyCommentExistsOnThread(addReply.commentId, useCasePayload.threadId);

    return this._replyRepository.addReply(addReply);
  }
}

export default AddReplyUseCase;
