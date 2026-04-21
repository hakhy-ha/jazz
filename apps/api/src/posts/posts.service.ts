import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type PostMediaType = 'IMAGE' | 'VIDEO';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: string, caption: string | undefined, mediaUrl: string | undefined, mediaType?: PostMediaType) {
    return this.prisma.post.create({
      data: { userId, caption, mediaUrl, mediaType }
    });
  }

  async feed() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        comments: true,
        reactions: true,
        user: {
          select: { id: true, name: true, nickname: true, avatarUrl: true }
        }
      }
    });
  }

  async comment(postId: string, userId: string, content: string) {
    const comment = await this.prisma.comment.create({
      data: { postId, userId, content }
    });

    // Get post owner to create notification
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (post && post.userId !== userId) {
      const commentingUser = await this.prisma.user.findUnique({ where: { id: userId } });
      await this.prisma.notification.create({
        data: {
          userId: post.userId,
          type: 'COMMENT',
          payload: JSON.stringify({
            postId,
            commenterId: userId,
            commenterName: commentingUser?.name,
            content,
          }),
        },
      });
    }

    return comment;
  }

  async react(postId: string, userId: string, emoji: string) {
    // Check if user already reacted with this emoji
    const existing = await this.prisma.reaction.findFirst({
      where: { postId, userId, emoji },
    });

    if (existing) {
      // Remove the reaction
      return this.prisma.reaction.delete({ where: { id: existing.id } });
    }

    const reaction = await this.prisma.reaction.create({
      data: { postId, userId, emoji }
    });

    // Get post owner to create notification
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (post && post.userId !== userId) {
      const reactingUser = await this.prisma.user.findUnique({ where: { id: userId } });
      await this.prisma.notification.create({
        data: {
          userId: post.userId,
          type: 'LIKE',
          payload: JSON.stringify({
            postId,
            reacterId: userId,
            reacterName: reactingUser?.name,
            emoji,
          }),
        },
      });
    }

    return reaction;
  }
}
