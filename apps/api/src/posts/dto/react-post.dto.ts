import { IsNotEmpty, IsString } from 'class-validator';

export class ReactPostDto {
  @IsString()
  @IsNotEmpty()
  emoji!: string;
}
