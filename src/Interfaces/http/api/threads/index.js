import ThreadsHandler from './handler.js';
import createThreadsRouter from './routes.js';
import createAuthMiddleware from '../../../../Infrastructures/http/middlewares/authMiddleware.js';
import comments from '../comments/index.js';

export default (container) => {
  const threadsHandler = new ThreadsHandler(container);
  const authMiddleware = createAuthMiddleware(container);
  const commentsRouter = comments(container);
  return createThreadsRouter(threadsHandler, authMiddleware, commentsRouter);
};
