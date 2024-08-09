import { RequestHandler } from 'express';

export const getStatus: RequestHandler = async (req, res, next) => {
  try {
    res.json({
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
