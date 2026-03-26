import { describe, expect, it, vi, beforeEach } from 'vitest';
import createAuthMiddleware from '../authMiddleware.js';
import AuthenticationTokenManager from '../../../../Applications/security/AuthenticationTokenManager.js';

describe('authMiddleware', () => {
  let mockContainer;
  let mockTokenManager;
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockTokenManager = {
      verifyAccessToken: vi.fn(),
      decodePayload: vi.fn(),
    };

    mockContainer = {
      getInstance: vi.fn().mockReturnValue(mockTokenManager),
    };

    mockReq = {
      headers: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    mockNext = vi.fn();
  });

  it('should return 401 when authorization header is missing', async () => {
    // Arrange
    const authMiddleware = createAuthMiddleware(mockContainer);

    // Action
    await authMiddleware(mockReq, mockRes, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Missing authentication',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 when authorization header does not start with Bearer', async () => {
    // Arrange
    mockReq.headers.authorization = 'Basic token123';
    const authMiddleware = createAuthMiddleware(mockContainer);

    // Action
    await authMiddleware(mockReq, mockRes, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Missing authentication',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 when token verification fails', async () => {
    // Arrange
    mockReq.headers.authorization = 'Bearer invalid_token';
    mockTokenManager.verifyAccessToken.mockRejectedValue(new Error('Token invalid'));
    const authMiddleware = createAuthMiddleware(mockContainer);

    // Action
    await authMiddleware(mockReq, mockRes, mockNext);

    // Assert
    expect(mockContainer.getInstance).toHaveBeenCalledWith(AuthenticationTokenManager.name);
    expect(mockTokenManager.verifyAccessToken).toHaveBeenCalledWith('invalid_token');
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Invalid authentication',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next and set req.auth when authentication is successful', async () => {
    // Arrange
    mockReq.headers.authorization = 'Bearer valid_token';
    mockTokenManager.verifyAccessToken.mockResolvedValue();
    mockTokenManager.decodePayload.mockResolvedValue({ id: 'user-123', username: 'testuser' });
    const authMiddleware = createAuthMiddleware(mockContainer);

    // Action
    await authMiddleware(mockReq, mockRes, mockNext);

    // Assert
    expect(mockContainer.getInstance).toHaveBeenCalledWith(AuthenticationTokenManager.name);
    expect(mockTokenManager.verifyAccessToken).toHaveBeenCalledWith('valid_token');
    expect(mockTokenManager.decodePayload).toHaveBeenCalledWith('valid_token');
    expect(mockReq.auth).toEqual({ userId: 'user-123' });
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  it('should return 401 when decodePayload fails', async () => {
    // Arrange
    mockReq.headers.authorization = 'Bearer valid_token';
    mockTokenManager.verifyAccessToken.mockResolvedValue();
    mockTokenManager.decodePayload.mockRejectedValue(new Error('Decode failed'));
    const authMiddleware = createAuthMiddleware(mockContainer);

    // Action
    await authMiddleware(mockReq, mockRes, mockNext);

    // Assert
    expect(mockTokenManager.verifyAccessToken).toHaveBeenCalledWith('valid_token');
    expect(mockTokenManager.decodePayload).toHaveBeenCalledWith('valid_token');
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Invalid authentication',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
