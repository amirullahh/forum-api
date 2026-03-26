import express from 'express';

const createCommentsRouter = (handler, authMiddleware, repliesRouter) => {
  const router = express.Router({ mergeParams: true });

  router.post('/', authMiddleware, handler.postCommentHandler);
  router.delete('/:commentId', authMiddleware, handler.deleteCommentHandler);
  router.put('/:commentId/likes', authMiddleware, handler.putCommentLikeHandler);

  // Nested replies routes
  router.use('/:commentId/replies', repliesRouter);

  return router;
};

export default createCommentsRouter;
