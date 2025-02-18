import express from 'express';
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from '../controllers/message.controller.js';
import protectedRoute from '../middleware/protectedRoute.js';

const messageRoutes = express.Router();

messageRoutes.get('/conversations', protectedRoute, getUsersForSidebar);
messageRoutes.get('/:id', protectedRoute, getMessages);
messageRoutes.post('/send/:id', protectedRoute, sendMessage);
export default messageRoutes;
