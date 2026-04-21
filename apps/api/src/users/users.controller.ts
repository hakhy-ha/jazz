import { Body, Controller, Get, Patch, Query, UseGuards, Post, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser('userId') userId: string) {
    return this.usersService.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@CurrentUser('userId') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/fcm-token')
  async updateFcmToken(@CurrentUser('userId') userId: string, @Body('token') token: string) {
    return this.usersService.updateFcmToken(userId, token);
  }

  @Get(':userId')
  async getUserProfile(@Param('userId') userId: string) {
    return this.usersService.getUserWithFollowStats(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async search(@Query('q') query: string) {
    return this.usersService.search(query || '');
  }
}
