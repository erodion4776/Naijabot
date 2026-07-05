import { prisma } from '../prisma/client';
import { Group } from '@prisma/client';

export class GroupRepository {
  async findById(id: string): Promise<Group | null> {
    return prisma.group.findUnique({ where: { id }, include: { settings: true } });
  }

  async create(data: Group): Promise<Group> {
    return prisma.group.create({ data });
  }

  async updateSettings(groupId: string, settings: any): Promise<void> {
    await prisma.groupSettings.update({
      where: { groupId },
      data: settings,
    });
  }
}
