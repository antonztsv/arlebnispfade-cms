import express from 'express';

const app = express();
const port = 8000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello from the TypeScript backend!' });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
