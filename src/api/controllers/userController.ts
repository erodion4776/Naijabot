import { Request, Response, NextFunction } from 'express';
import { mockUsers, addLog } from '../../database/mockDb';

export function getUsers(req: Request, res: Response, next: NextFunction): void {
  try {
    res.json(mockUsers);
  } catch (err) {
    next(err);
  }
}

export function updateUser(req: Request, res: Response, next: NextFunction): void {
  try {
    const user = mockUsers.find(u => u.id === req.params.id);
    if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    const { name, warningCount, strikeCount, status } = req.body;

    if (name !== undefined) user.name = name;
    if (warningCount !== undefined) user.warningCount = warningCount;
    if (strikeCount !== undefined) user.strikeCount = strikeCount;
    if (status !== undefined) user.status = status;

    addLog('api', `Updated user state for "${user.name}" (${user.whatsappId})`, 'info');
    res.json(user);
  } catch (err) {
    next(err);
  }
}
