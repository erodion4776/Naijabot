import { WASocket, proto } from '@whiskeysockets/baileys';

export class BadWordDetector {
  async detect(msg: proto.IWebMessageInfo, settings: any): Promise<boolean> {
    // Implement bad word detection
    return false;
  }
}
