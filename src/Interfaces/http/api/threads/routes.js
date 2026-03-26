import express from 'express';
import threadsLimiter from '../../../../Infrastructures/http/middlewares/rateLimitMiddleware.js';

const createThreadsRouter = (handler, authMiddleware, commentsRouter) => {
  const router = express.Router();

  // Apply rate limiting to all /threads routes
  router.use(threadsLimiter);

  router.post('/', authMiddleware, handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadByIdHandler);

  // Nested comments routes
  router.use('/:threadId/comments', commentsRouter);

  return router;
};

export default createThreadsRouter;
