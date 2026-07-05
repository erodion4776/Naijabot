import { WASocket, ConnectionState, AnyMessageContent } from '@whiskeysockets/baileys';
import { logger } from '../logger';
import { CommandRouter } from './CommandRouter';

export class EventManager {
  private commandRouter: CommandRouter;

  constructor() {
    this.commandRouter = new CommandRouter();
  }

  handleConnectionUpdate(update: Partial<ConnectionState>) {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== 401;
      logger.warn('Connection closed. Reconnecting:', shouldReconnect);
      // Logic for reconnection will be in WhatsAppService
    } else if (connection === 'open') {
      logger.info('WhatsApp connection opened successfully.');
    }
  }

  async handleMessage(sock: WASocket, message: any) {
    if (!message.messages) return;
    const msg = message.messages[0];
    if (msg.key.fromMe) return;

    const remoteJid = msg.key.remoteJid;
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

    if (!text) return;

    const isGroup = remoteJid?.endsWith('@g.us');
    logger.info({ remoteJid, isGroup, text }, 'Received message');

    if (text.startsWith('/')) {
        await this.commandRouter.handleCommand(sock, msg, text);
    }
  }
}
