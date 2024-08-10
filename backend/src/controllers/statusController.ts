import { RequestHandler } from 'express';

export const getStatus: RequestHandler = async (req, res, next) => {
  try {
    res.json({
      message: 'API is online',
      timestamp: new Date().toLocaleString('de-de', { timeZone: 'Europe/Berlin' }),
    });
  } catch (error) {
    next(error);
  }
};
