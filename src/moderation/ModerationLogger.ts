import { logger } from '../logger';

export class ModerationLogger {
  static info(message: string, context?: any) {
    logger.info({ context }, `[MODERATION] ${message}`);
  }

  static warn(message: string, context?: any) {
    logger.warn({ context }, `[MODERATION] ${message}`);
  }
}
