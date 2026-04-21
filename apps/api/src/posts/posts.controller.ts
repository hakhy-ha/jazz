import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CommentPostDto } from './dto/comment-post.dto';
import { ReactPostDto } from './dto/react-post.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@CurrentUser('userId') userId: string, @Body() dto: CreatePostDto) {
    return this.postsService.createPost(userId, dto.caption, dto.mediaUrl, dto.mediaType as any);
  }

  @Get()
  async feed() {
    return this.postsService.feed();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comment')
  async comment(@CurrentUser('userId') userId: string, @Param('id') postId: string, @Body() dto: CommentPostDto) {
    return this.postsService.comment(postId, userId, dto.content);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/react')
  async react(@CurrentUser('userId') userId: string, @Param('id') postId: string, @Body() dto: ReactPostDto) {
    return this.postsService.react(postId, userId, dto.emoji);
  }
}
