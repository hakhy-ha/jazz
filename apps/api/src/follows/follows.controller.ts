import { Controller, Post, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { FollowsService } from './follows.service';

@Controller('follows')
@UseGuards(JwtAuthGuard)
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  @Post(':userId')
  async follow(@CurrentUser() user: any, @Param('userId') followingId: string) {
    return this.followsService.follow(user.id, followingId);
  }

  @Delete(':userId')
  async unfollow(@CurrentUser() user: any, @Param('userId') followingId: string) {
    return this.followsService.unfollow(user.id, followingId);
  }

  @Get(':userId/followers')
  async getFollowers(@Param('userId') userId: string) {
    return this.followsService.getFollowers(userId);
  }

  @Get(':userId/following')
  async getFollowing(@Param('userId') userId: string) {
    return this.followsService.getFollowing(userId);
  }

  @Get(':userId/stats')
  async getFollowStats(@Param('userId') userId: string) {
    return this.followsService.getFollowStats(userId);
  }

  @Get(':userId/is-following')
  async isFollowing(@CurrentUser() user: any, @Param('userId') followingId: string) {
    const isFollowing = await this.followsService.isFollowing(user.id, followingId);
    return { isFollowing };
  }
}