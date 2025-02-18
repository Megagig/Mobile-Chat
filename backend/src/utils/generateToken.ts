import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '15d',
  });

  res.cookie('jwt', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true, // cookie cannot be accessed by client side scripts. prevent xss attacks or cross site scripting attacks
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict', // CSRF attacks - cross site request forgery
  });

  return token;
};

export default generateToken;
