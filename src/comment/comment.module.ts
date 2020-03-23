import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from 'src/idea/idea.entity';
import { UserEntity } from 'src/user/user.entity';
import { CommentController } from './comment.controller';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, IdeaEntity, UserEntity])
  ],
  providers: [CommentService],
  controllers: [CommentController]
})
export class CommentModule { }
