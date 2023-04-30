import { Module } from '@nestjs/common';
import { BeatsService } from './beats.service';
import { BeatsController } from './beats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Beat } from './entities/beat.entity';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { UploadsService } from 'src/uploads/uploads.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Comment, Beat, User])],
  controllers: [BeatsController],
  providers: [BeatsService, UploadsService],
})
export class BeatsModule {}
