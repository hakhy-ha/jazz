import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/request')
  async sendRequest(@CurrentUser('userId') userId: string, @Param('id') receiverId: string) {
    return this.friendsService.sendRequest(userId, receiverId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/accept')
  async acceptRequest(@CurrentUser('userId') userId: string, @Param('id') requestId: string) {
    return this.friendsService.acceptRequest(userId, requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reject')
  async rejectRequest(@CurrentUser('userId') userId: string, @Param('id') requestId: string) {
    return this.friendsService.rejectRequest(userId, requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('requests')
  async listRequests(@CurrentUser('userId') userId: string) {
    return this.friendsService.listRequests(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async listFriends(@CurrentUser('userId') userId: string) {
    return this.friendsService.listFriends(userId);
  }
}
