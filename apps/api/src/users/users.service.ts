import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        nickname: true,
        avatarUrl: true,
        bio: true,
        createdAt: true
      }
    });
  }

  async updateProfile(id: string, data: { name?: string; nickname?: string; bio?: string; avatarUrl?: string }) {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  async updateFcmToken(userId: string, token: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { fcmToken: token },
    });
  }

  async getUserWithFollowStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        followers: { select: { followerId: true } },
        following: { select: { followingId: true } },
      },
    });

    if (!user) return null;

    const { followers, following, ...userWithoutRelations } = user;
    return {
      ...userWithoutRelations,
      followersCount: followers.length,
      followingCount: following.length,
    };
  }

  async search(query: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { nickname: { contains: query } },
          { email: { contains: query } }
        ]
      },
      take: 20,
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        avatarUrl: true,
        bio: true
      }
    });
  }
}
