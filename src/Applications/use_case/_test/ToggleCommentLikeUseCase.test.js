import { describe, it, expect } from 'vitest';
import ToggleCommentLikeUseCase from '../ToggleCommentLikeUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import CommentLikeRepository from '../../../Domains/comment_likes/CommentLikeRepository.js';

describe('ToggleCommentLikeUseCase', () => {
  it('should orchestrate the toggle comment like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExistsOnThread = vi.fn(() => Promise.resolve());
    mockCommentLikeRepository.toggleLike = vi.fn(() => Promise.resolve());

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await toggleCommentLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExistsOnThread).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    );
    expect(mockCommentLikeRepository.toggleLike).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.userId
    );
  });
});
