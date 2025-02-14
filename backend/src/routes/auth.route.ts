import express from 'express';
import {
  getCurrentUser,
  login,
  logout,
  signup,
} from '../controllers/auth.controller.js';
import protectedRoute from '../middleware/protectedRoute.js';

const authRoutes = express.Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.get('/current-user', protectedRoute, getCurrentUser);

export default authRoutes;
