import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cookieParser()); // for parsing cookies
app.use(express.json()); // for parsing application/json

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/messages', messageRoutes);

app.listen(5000, () => {
  console.log('app listening on port 5000!');
});
