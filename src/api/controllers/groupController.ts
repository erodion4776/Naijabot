import { Request, Response, NextFunction } from 'express';
import { mockGroups, addLog } from '../../database/mockDb';
import { logger } from '../../logger';

export function getGroups(req: Request, res: Response, next: NextFunction): void {
  try {
    res.json(mockGroups);
  } catch (err) {
    next(err);
  }
}

export function getGroupById(req: Request, res: Response, next: NextFunction): void {
  try {
    const group = mockGroups.find(g => g.id === req.params.id);
    if (!group) {
      res.status(404).json({ status: 'error', message: 'Group not found' });
      return;
    }
    res.json(group);
  } catch (err) {
    next(err);
  }
}

export function createGroup(req: Request, res: Response, next: NextFunction): void {
  try {
    const { id, name, description } = req.body;

    if (!id || !name) {
      res.status(400).json({ status: 'error', message: 'Group ID and Name are required' });
      return;
    }

    const exists = mockGroups.some(g => g.id === id);
    if (exists) {
      res.status(409).json({ status: 'error', message: 'Group with this ID already exists' });
      return;
    }

    const newGroup = {
      id,
      name,
      description: description || '',
      memberCount: 1,
      status: 'ACTIVE' as const,
      adminCount: 1,
      settings: {
        antiSpam: true,
        antiLinks: false,
        antiBadWords: true,
        antiFlood: false,
        welcomeMessage: 'Welcome to {name}, {user}!',
        goodbyeMessage: '{user} has left.',
        rulesMessage: 'Please follow group guidelines.'
      }
    };

    mockGroups.push(newGroup);
    addLog('api', `Created new group "${name}" (${id}) via dashboard`, 'info');
    res.status(201).json(newGroup);
  } catch (err) {
    next(err);
  }
}

export function updateGroupSettings(req: Request, res: Response, next: NextFunction): void {
  try {
    const group = mockGroups.find(g => g.id === req.params.id);
    if (!group) {
      res.status(404).json({ status: 'error', message: 'Group not found' });
      return;
    }

    const { settings, status } = req.body;

    if (status) {
      group.status = status;
    }

    if (settings) {
      group.settings = {
        ...group.settings,
        ...settings
      };
    }

    addLog('api', `Updated settings for group "${group.name}"`, 'info');
    res.json(group);
  } catch (err) {
    next(err);
  }
}
