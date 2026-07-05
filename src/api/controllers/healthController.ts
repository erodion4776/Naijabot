import { Request, Response, NextFunction } from 'express';
import os from 'os';

export function getHealth(req: Request, res: Response, next: NextFunction): void {
  try {
    const healthInfo = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        cpuCount: os.cpus().length,
        freeMemory: os.freemem(),
        totalMemory: os.totalmem(),
      },
      bot: {
        connectionStatus: 'DISCONNECTED',
        sessionActive: false,
        reconnectsCount: 0,
        groupsCount: 0,
      }
    };
    res.json(healthInfo);
  } catch (err) {
    next(err);
  }
}
