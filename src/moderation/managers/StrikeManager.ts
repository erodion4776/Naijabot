import { UserRepository } from '../../database/repositories/UserRepository';
import { ModerationLogger } from '../ModerationLogger';

export class StrikeManager {
  private userRepo = new UserRepository();

  async addStrike(whatsappId: string) {
    const user = await this.userRepo.findByWhatsappId(whatsappId);
    if (!user) return;

    await this.userRepo.update(user.id, {
        strikeCount: user.strikeCount + 1
    });
    
    ModerationLogger.warn(`Strike added for ${whatsappId}`);
  }
}
