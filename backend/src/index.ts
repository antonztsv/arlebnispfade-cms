import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { connectToDatabase } from './db/database';
import statusRoutes from './routes/statusRoutes';
import authRoutes from './routes/authRoutes';
import contentRoutes from './routes/contentRoutes';
import routeRoutes from './routes/routeRoutes';
import { authMiddleware, roleMiddleware } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const apiRouter = express.Router();

// Public status routes
apiRouter.use('/', statusRoutes);

// Auth routes
apiRouter.use('/auth', authRoutes);

// CMS routes
apiRouter.use('/routes', routeRoutes);
apiRouter.use('/content', contentRoutes);

app.use('/api', apiRouter);

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
