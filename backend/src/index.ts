import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

const app = express();

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(5000, () => {
  console.log('app listening on port 5000!');
});
