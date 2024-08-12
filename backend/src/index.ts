import config from './config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { connectToDatabase } from './db/database';
import apiRoutes from './routes';
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.use(errorMiddleware);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  });

export default app;
