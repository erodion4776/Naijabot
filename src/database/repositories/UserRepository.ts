import { prisma } from '../prisma/client';
import { User } from '@prisma/client';

export class UserRepository {
  async findByWhatsappId(whatsappId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { whatsappId } });
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }
}
