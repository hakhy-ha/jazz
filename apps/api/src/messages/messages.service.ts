import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type MessageType = 'TEXT' | 'VOICE' | 'IMAGE' | 'VIDEO' | 'FILE';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'SEEN';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(senderId: string, payload: { receiverId: string; type: MessageType; content?: string; mediaUrl?: string }) {
    return this.prisma.message.create({
      data: {
        senderId,
        receiverId: payload.receiverId,
        type: payload.type,
        content: payload.content,
        mediaUrl: payload.mediaUrl,
        status: 'SENT'
      }
    });
  }

  async getConversation(userId: string, peerId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: peerId },
          { senderId: peerId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async markAsDelivered(messageId: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { status: 'DELIVERED' }
    });
  }

  async markAsSeen(messageId: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { status: 'SEEN' }
    });
  }
}
