import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as chatController from '../controllers/chat';

const router = Router();

// Conversations
router.get('/conversations', authenticate, chatController.getConversations);
router.post('/conversations', authenticate, chatController.createConversation);
router.get('/conversations/:id/messages', authenticate, chatController.getMessages);

// Messages
router.post('/messages', authenticate, chatController.sendMessage);

export default router;
