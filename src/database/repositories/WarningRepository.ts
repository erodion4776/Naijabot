import { prisma } from '../prisma/client';
import { Warning } from '@prisma/client';

export class WarningRepository {
  async create(data: Omit<Warning, 'id' | 'timestamp'>): Promise<Warning> {
    return prisma.warning.create({ data });
  }

  async countByUserId(userId: string): Promise<number> {
    return prisma.warning.count({ where: { userId } });
  }
}
