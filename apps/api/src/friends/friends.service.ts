import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async sendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot friend yourself');
    }
    const existing = await this.prisma.friendRequest.findFirst({
      where: {
        senderId,
        receiverId
      }
    });
    if (existing) {
      throw new BadRequestException('Request already exists');
    }
    return this.prisma.friendRequest.create({
      data: { senderId, receiverId, status: 'PENDING' }
    });
  }

  async acceptRequest(userId: string, requestId: string) {
    const request = await this.prisma.friendRequest.findUnique({ where: { id: requestId } });
    if (!request || request.receiverId !== userId) {
      throw new NotFoundException('Friend request not found');
    }
    return this.prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' }
    });
  }

  async rejectRequest(userId: string, requestId: string) {
    const request = await this.prisma.friendRequest.findUnique({ where: { id: requestId } });
    if (!request || request.receiverId !== userId) {
      throw new NotFoundException('Friend request not found');
    }
    return this.prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' }
    });
  }

  async listRequests(userId: string) {
    return this.prisma.friendRequest.findMany({
      where: {
        OR: [{ receiverId: userId }, { senderId: userId }]
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async listFriends(userId: string) {
    const accepted = await this.prisma.friendRequest.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      include: {
        sender: {
          select: { id: true, name: true, nickname: true, avatarUrl: true }
        },
        receiver: {
          select: { id: true, name: true, nickname: true, avatarUrl: true }
        }
      }
    });
    return accepted.map((request) => {
      const friend = request.senderId === userId ? request.receiver : request.sender;
      return {
        id: request.id,
        user: friend
      };
    });
  }
}
