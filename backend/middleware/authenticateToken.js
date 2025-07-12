import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Missing or malformed token.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }

    req.user = user; // decoded payload (e.g., { user_id, email })
    next();
  });
};

export default authenticateToken;
