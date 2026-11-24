import { Request, Response, NextFunction } from 'express';
import * as chatService from '../services/chat';
import { sendSuccess } from '../utils/response';

export async function getConversations(req: Request, res: Response, next: NextFunction) {
  try {
    const conversations = await chatService.getConversations(req.user!.id);
    sendSuccess(res, conversations, 'Conversations retrieved');
  } catch (error) {
    next(error);
  }
}

export async function createConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const { listingId, recipientId } = req.body;
    const conversation = await chatService.createConversation(
      listingId,
      req.user!.id,
      recipientId
    );
    sendSuccess(res, conversation, 'Conversation created', 201);
  } catch (error) {
    next(error);
  }
}

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const messages = await chatService.getMessages(
      req.params.id as string,
      req.user!.id
    );
    sendSuccess(res, messages, 'Messages retrieved');
  } catch (error) {
    next(error);
  }
}

export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { conversationId, content } = req.body;
    const message = await chatService.sendMessage(
      conversationId,
      req.user!.id,
      content
    );
    sendSuccess(res, message, 'Message sent', 201);
  } catch (error) {
    next(error);
  }
}
