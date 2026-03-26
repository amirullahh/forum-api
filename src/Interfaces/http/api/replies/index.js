import RepliesHandler from './handler.js';
import createRepliesRouter from './routes.js';
import createAuthMiddleware from '../../../../Infrastructures/http/middlewares/authMiddleware.js';

export default (container) => {
  const repliesHandler = new RepliesHandler(container);
  const authMiddleware = createAuthMiddleware(container);
  return createRepliesRouter(repliesHandler, authMiddleware);
};
