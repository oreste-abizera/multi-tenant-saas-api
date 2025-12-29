import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { config } from '../config';
import { JWTPayload } from '../types';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as StringValue,
  });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwt.secret) as JWTPayload;
};
