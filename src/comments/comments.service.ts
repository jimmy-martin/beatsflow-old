import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOneBy({ id });
    if (!comment) {
      throw new NotFoundException(`Comment ${id} not found`);
    }
    this.commentsRepository.merge(comment, updateCommentDto);
    return await this.commentsRepository.save(comment);
  }

  async remove(id: number): Promise<void> {
    await this.commentsRepository.delete(id);
  }
}
