import jwt from 'jsonwebtoken';
import process from 'process';
const SECRET_KEY = process.env.JWT_SECRET || 'jkshfkjsdh8475';

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.log(error);
    return null;
  }
};
