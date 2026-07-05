import { Request, Response, NextFunction } from 'express';
import { logger } from '../../logger';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const responseTimeMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

    logger.info({
      req: {
        method: req.method,
        url: req.url,
        ip: req.ip || req.socket.remoteAddress,
      },
      res: {
        statusCode: res.statusCode,
      },
      durationMs: parseFloat(responseTimeMs),
    }, `📡 HTTP ${req.method} ${req.url} - ${res.statusCode} (${responseTimeMs}ms)`);
  });

  next();
}
