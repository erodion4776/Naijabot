import { WASocket, proto } from '@whiskeysockets/baileys';
import { logger } from '../logger';
import { eventBus } from '../events/EventBus';
import { EventType } from '../events/types';

export class CommandRouter {
  async handleCommand(sock: WASocket, msg: proto.IWebMessageInfo, text: string) {
    const command = text.split(' ')[0].toLowerCase();
    const remoteJid = msg.key.remoteJid!;

    logger.info({ command, remoteJid }, 'Processing command');

    eventBus.emit(EventType.COMMAND_EXECUTED, { command, remoteJid, sender: msg.key.participant || msg.key.remoteJid });

    switch (command) {
      case '/ping':
        await sock.sendMessage(remoteJid, { text: 'Pong!' });
        break;
      default:
        await sock.sendMessage(remoteJid, { text: 'Unknown command.' });
    }
  }
}
