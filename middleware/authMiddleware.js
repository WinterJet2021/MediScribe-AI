import { verifyToken } from '@clerk/backend';

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
