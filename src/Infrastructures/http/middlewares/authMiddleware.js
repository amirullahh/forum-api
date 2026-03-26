import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';

const createAuthMiddleware = (container) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          status: 'fail',
          message: 'Missing authentication',
        });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      const tokenManager = container.getInstance(AuthenticationTokenManager.name);
      await tokenManager.verifyAccessToken(token);

      const { id: userId } = await tokenManager.decodePayload(token);
      req.auth = { userId };

      next();
    // eslint-disable-next-line no-unused-vars
    } catch (_error) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid authentication',
      });
    }
  };
};

export default createAuthMiddleware;
