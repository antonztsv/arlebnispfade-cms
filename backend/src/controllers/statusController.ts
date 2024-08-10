import { RequestHandler } from 'express';

export const getStatus: RequestHandler = async (req, res, next) => {
  try {
    res.json({
      message: 'API is online',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
