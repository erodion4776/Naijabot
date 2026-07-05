import cron from 'node-cron';
import { logger } from '../logger';
import { eventBus } from '../events/EventBus';
import { EventType } from '../events/types';

export class SchedulerService {
  start() {
    // Example: Daily cleanup task
    cron.schedule('0 0 * * *', () => {
      logger.info('Running daily maintenance task...');
      eventBus.emit(EventType.TASK_EXECUTED, { task: 'daily-cleanup' });
    });
  }
}
