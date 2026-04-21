import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum PostMediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export class CreatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(280)
  caption?: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @IsOptional()
  @IsEnum(PostMediaType)
  mediaType?: PostMediaType;
}
