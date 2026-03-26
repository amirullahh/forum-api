import CommentsHandler from './handler.js';
import createCommentsRouter from './routes.js';
import createAuthMiddleware from '../../../../Infrastructures/http/middlewares/authMiddleware.js';
import replies from '../replies/index.js';

export default (container) => {
  const commentsHandler = new CommentsHandler(container);
  const authMiddleware = createAuthMiddleware(container);
  const repliesRouter = replies(container);
  return createCommentsRouter(commentsHandler, authMiddleware, repliesRouter);
};
