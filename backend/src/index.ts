import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(5000, () => {
  console.log('app listening on port 5000!');
});
