import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError, UnauthorizedError, NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export async function register(data: RegisterData) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('Email already in use', 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phone: data.phone,
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
}

export async function login(data: LoginData) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (user.banned) {
    throw new AppError('Your account has been banned', 403);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const { password: _, ...userWithoutPassword } = user;

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
}

export async function refreshToken(token: string) {
  if (!token) {
    throw new UnauthorizedError('Refresh token is required');
  }

  const decoded = verifyRefreshToken(token);

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);

  return { accessToken };
}
