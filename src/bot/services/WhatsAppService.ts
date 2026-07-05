import { 
  makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason, 
  WASocket 
} from '@whiskeysockets/baileys';
import pino from 'pino';
import { logger } from '../../logger';
import { EventManager } from '../EventManager';

export class WhatsAppService {
  private sock: WASocket | null = null;
  private eventManager: EventManager;

  constructor() {
    this.eventManager = new EventManager();
  }

  async connect() {
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');

    this.sock = makeWASocket({
      auth: state,
      logger: pino({ level: 'silent' }), // Suppress Baileys own logs
      printQRInTerminal: true,
    });

    this.sock.ev.on('creds.update', saveCreds);

    this.sock.ev.on('connection.update', (update) => {
      this.eventManager.handleConnectionUpdate(update);
      const { connection, lastDisconnect } = update;
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          this.connect();
        }
      }
    });

    this.sock.ev.on('messages.upsert', (message) => {
      if (!this.sock) return;
      this.eventManager.handleMessage(this.sock, message);
    });
  }
}
