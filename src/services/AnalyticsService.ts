import { eventBus } from '../events/EventBus';
import { EventType, BotEvent } from '../events/types';
import { logger } from '../logger';

export class AnalyticsService {
  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    eventBus.on(EventType.MESSAGE_RECEIVED, this.handleMessage.bind(this));
    eventBus.on(EventType.COMMAND_EXECUTED, this.handleCommand.bind(this));
  }

  private handleMessage(event: BotEvent) {
    logger.info('Analytics: Message received tracked.');
  }

  private handleCommand(event: BotEvent) {
    logger.info('Analytics: Command executed tracked.');
  }
}
