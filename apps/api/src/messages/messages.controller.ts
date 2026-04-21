import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async sendMessage(@CurrentUser('userId') senderId: string, @Body() dto: SendMessageDto) {
    return this.messagesService.sendMessage(senderId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':peerId')
  async getConversation(@CurrentUser('userId') userId: string, @Param('peerId') peerId: string) {
    return this.messagesService.getConversation(userId, peerId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/delivered')
  async markDelivered(@Param('id') id: string) {
    return this.messagesService.markAsDelivered(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/seen')
  async markSeen(@Param('id') id: string) {
    return this.messagesService.markAsSeen(id);
  }
}
