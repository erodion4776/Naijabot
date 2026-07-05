import { eventBus } from '../events/EventBus';
import { EventType, BotEvent } from '../events/types';
import { prisma } from '../database/prisma/client';

export class AuditLogService {
  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    Object.values(EventType).forEach((type) => {
      eventBus.on(type as EventType, this.handleEvent.bind(this));
    });
  }

  private async handleEvent(event: BotEvent) {
    await prisma.log.create({
      data: {
        timestamp: event.timestamp,
        type: event.type,
        message: JSON.stringify(event.payload),
        level: 'info',
      },
    });
  }
}
