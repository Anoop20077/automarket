import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function updateMe(
  userId: string,
  data: { name?: string; phone?: string; avatar?: string }
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
