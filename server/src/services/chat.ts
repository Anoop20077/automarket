import { PrismaClient } from '@prisma/client';
import { NotFoundError, ForbiddenError } from '../utils/errors';

const prisma = new PrismaClient();

export async function getConversations(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId },
      },
    },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          price: true,
          images: { take: 1 },
        },
      },
      participants: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return conversations;
}

export async function createConversation(
  listingId: string,
  userId: string,
  recipientId: string
) {
  // Check if conversation already exists between these users for this listing
  const existing = await prisma.conversation.findFirst({
    where: {
      listingId,
      AND: [
        { participants: { some: { userId } } },
        { participants: { some: { userId: recipientId } } },
      ],
    },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          price: true,
          images: { take: 1 },
        },
      },
      participants: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (existing) {
    return existing;
  }

  const conversation = await prisma.conversation.create({
    data: {
      listingId,
      participants: {
        create: [{ userId }, { userId: recipientId }],
      },
    },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          price: true,
          images: { take: 1 },
        },
      },
      participants: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      },
      messages: true,
    },
  });

  return conversation;
}

export async function getMessages(conversationId: string, userId: string) {
  // Check user is participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      userId_conversationId: { userId, conversationId },
    },
  });

  if (!participant) {
    throw new ForbiddenError('You are not a participant of this conversation');
  }

  // Mark unread messages from other users as read
  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      read: false,
    },
    data: { read: true },
  });

  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: {
      sender: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return messages;
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
) {
  // Check sender is participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      userId_conversationId: { userId: senderId, conversationId },
    },
  });

  if (!participant) {
    throw new ForbiddenError('You are not a participant of this conversation');
  }

  const message = await prisma.message.create({
    data: {
      content,
      senderId,
      conversationId,
    },
    include: {
      sender: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });

  // Update conversation updatedAt
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}
