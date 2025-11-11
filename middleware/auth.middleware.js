import { verifyToken } from '../utils/jwt.js';

/**
 * authenticateToken
 * - Extracts token from Authorization header (Bearer TOKEN) or from req.headers['x-access-token']
 * - Verifies token using your utils/verifyToken
 * - Attaches decoded token payload to req.user
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const tokenForHeader =
    authHeader && authHeader.split(' ')[0] === 'Bearer' ? authHeader.split(' ')[1] : null;

  const token = tokenForHeader || req.headers['x-access-token'] || req.headers['token'];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  const decode = verifyToken(token);
  if (!decode) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
  req.user = decode;
  next();
};

/**
 * requireRole
 * - Accepts an array of allowed roles (e.g. ["ADMIN"] or ["ADMIN", "AUTHOR"])
 * - Checks req.user.role and returns 403 if not allowed
 *
 * Usage:
 *  router.post("/stories", authenticateToken, requireRole(["AUTHOR","ADMIN"]), createStory)
 */

export const requireRole = (allowedRoles = []) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action',
        requiredRoles: roles,
      });
    }
    next();
  };
};

/**
 * authorizeOwnership
 * - Simpler ownership helper that keeps DB logic outside middleware.
 * - Accepts an async function `getOwnerId(req)` that returns the resource's owner/author id.
 * - If current user is ADMIN -> allowed.
 * - If current user id === ownerId -> allowed.
 * - Else -> 403
 *
 * Example:
 *  router.put("/:id",
 *    authenticateToken,
 *    authorizeOwnership(async (req) => {
 *      const story = await prisma.story.findUnique({ where: { id: req.params.id }, select: { authorId: true }});
 *      return story?.authorId;
 *    }),
 *    updateStory
 *  );
 */

export const authorizeOwnership = (getOwnerId) => {
  if (typeof getOwnerId !== 'function') {
    throw new Error('getOwnerId must be a function that returns the resource owner ID');
  }
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      //admin bypass authorization
      if (req.user.role === 'ADMIN') {
        return next();
      }

      const ownerId = await getOwnerId(req);
      if (ownerId === undefined || ownerId === null) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      if (ownerId !== req.user.id) {
        return res
          .status(403)
          .json({ message: 'You do not have permission to perform this action' });
      }
      return next();
    } catch (error) {
      console.error('Error in authorizeOwnership middleware:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};
