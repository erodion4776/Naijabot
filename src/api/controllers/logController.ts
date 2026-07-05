import { Request, Response, NextFunction } from 'express';
import { mockLogs, addLog } from '../../database/mockDb';

export function getLogs(req: Request, res: Response, next: NextFunction): void {
  try {
    res.json(mockLogs);
  } catch (err) {
    next(err);
  }
}

export function createLog(req: Request, res: Response, next: NextFunction): void {
  try {
    const { type, message, level } = req.body;
    if (!type || !message) {
      res.status(400).json({ status: 'error', message: 'Log type and message are required' });
      return;
    }
    const newLog = addLog(type, message, level || 'info');
    res.status(201).json(newLog);
  } catch (err) {
    next(err);
  }
}
