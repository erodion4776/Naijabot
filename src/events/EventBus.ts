import { EventEmitter } from 'events';
import { BotEvent, EventType } from './types';

export class EventBus {
  private emitter = new EventEmitter();

  emit(type: EventType, payload: any) {
    const event: BotEvent = {
      type,
      payload,
      timestamp: new Date(),
    };
    this.emitter.emit(type, event);
  }

  on(type: EventType, listener: (event: BotEvent) => void) {
    this.emitter.on(type, listener);
  }
}

// Global instance to simplify usage across modules, 
// though dependency injection is preferred for testability
export const eventBus = new EventBus();
