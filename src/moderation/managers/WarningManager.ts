import { UserRepository } from '../../database/repositories/UserRepository';
import { WarningRepository } from '../../database/repositories/WarningRepository';
import { ModerationLogger } from '../ModerationLogger';

export class WarningManager {
  private userRepo = new UserRepository();
  private warningRepo = new WarningRepository();

  async addWarning(whatsappId: string, groupId: string, reason: string) {
    const user = await this.userRepo.findByWhatsappId(whatsappId);
    if (!user) return;

    await this.warningRepo.create({
        userId: user.id,
        groupId,
        reason
    });
    
    ModerationLogger.warn(`Warning added for ${whatsappId}`, { reason });
  }
}
