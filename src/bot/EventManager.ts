import { WASocket, ConnectionState, proto } from '@whiskeysockets/baileys';
import { logger } from '../logger';
import { CommandRouter } from './CommandRouter';
import { ModerationEngine } from '../moderation/ModerationEngine';
import { eventBus } from '../events/EventBus';
import { EventType } from '../events/types';

export class EventManager {
  private commandRouter: CommandRouter;
  private moderationEngine: ModerationEngine;

  constructor() {
    this.commandRouter = new CommandRouter();
    this.moderationEngine = new ModerationEngine();
  }

  handleConnectionUpdate(update: Partial<ConnectionState>) {
    const { connection } = update;
    if (connection === 'close') {
      logger.warn('Connection closed.');
    } else if (connection === 'open') {
      logger.info('WhatsApp connection opened successfully.');
    }
  }

  async handleMessage(sock: WASocket, message: any) {
    if (!message.messages) return;
    const msg = message.messages[0];
    if (msg.key.fromMe) return;

    // Emit Event
    eventBus.emit(EventType.MESSAGE_RECEIVED, { remoteJid: msg.key.remoteJid, message: msg.message });

    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

    // Run moderation
    const shouldProceed = await this.moderationEngine.process(sock, msg);
    if (!shouldProceed) return;

    if (!text) return;

    if (text.startsWith('/')) {
        await this.commandRouter.handleCommand(sock, msg, text);
    }
  }
}
