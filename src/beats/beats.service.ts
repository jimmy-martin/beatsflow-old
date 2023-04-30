import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBeatDto } from './dto/create-beat.dto';
import { UpdateBeatDto } from './dto/update-beat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Beat } from './entities/beat.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { Comment } from 'src/comments/entities/comment.entity';
import { UploadsService } from 'src/uploads/uploads.service';

@Injectable()
export class BeatsService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Beat)
    private beatsRepository: Repository<Beat>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private readonly uploadsService: UploadsService,
  ) {}

  async create(createBeatDto: CreateBeatDto): Promise<Beat> {
    const category = await this.categoriesRepository.findOne({
      where: { id: createBeatDto.categoryId },
    });

    const user = await this.usersRepository.findOne({
      where: { id: createBeatDto.userId },
    });

    if (!category || !user) {
      throw new NotFoundException(
        `Category ${createBeatDto.categoryId} or User ${createBeatDto.userId} not found`,
      );
    }

    const newBeat = this.beatsRepository.create(createBeatDto);

    newBeat.category = category;
    newBeat.user = user;
    newBeat.audioUrl = 'test.mp3';

    return await this.beatsRepository.save(newBeat);
  }

  async findAll(): Promise<Beat[]> {
    return await this.beatsRepository.find();
  }

  async findOne(id: number): Promise<Beat> {
    const beat = await this.beatsRepository.findOneBy({ id });
    if (!beat) {
      throw new NotFoundException(`Beat ${id} not found`);
    }
    return beat;
  }

  async update(id: number, updateBeatDto: UpdateBeatDto): Promise<Beat> {
    const beat = await this.beatsRepository.findOneBy({ id });
    if (!beat) {
      throw new NotFoundException(`Beat ${id} not found`);
    }
    this.beatsRepository.merge(beat, updateBeatDto);
    return await this.beatsRepository.save(beat);
  }

  async remove(id: number): Promise<void> {
    await this.beatsRepository.delete(id);
  }

  async createComment(
    id: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const beat = await this.beatsRepository.findOneBy({ id });
    const user = await this.usersRepository.findOne({
      where: { id: createCommentDto.authorId },
    });

    if (!beat || !user) {
      throw new NotFoundException(
        `Beat ${id} or User ${createCommentDto.authorId} not found`,
      );
    }

    const newComment = this.commentsRepository.create(createCommentDto);

    newComment.beat = beat;
    newComment.author = user;

    return await this.commentsRepository.save(newComment);
  }

  async getComments(id: number): Promise<Comment[]> {
    const beat = await this.beatsRepository.findOneBy({ id });

    if (!beat) {
      throw new NotFoundException(`Beat ${id} not found`);
    }

    return await this.commentsRepository.find({
      where: { beat: { id: beat.id } },
    });
  }

  async uploadImage(id: number, file: Express.Multer.File): Promise<Beat> {
    const beat = await this.beatsRepository.findOneBy({ id });

    if (!beat) {
      throw new NotFoundException(`Beat ${id} not found`);
    }

    if (beat.imageUrl && beat.imageUrl !== 'beats_placeholder.png') {
      await this.uploadsService.deleteOldFile(beat.imageUrl);
    }

    const imagePath = `/uploads/image/${file.filename}`;
    beat.imageUrl = imagePath;
    return await this.beatsRepository.save(beat);
  }

  async uploadAudio(id: number, file: Express.Multer.File): Promise<Beat> {
    const beat = await this.beatsRepository.findOneBy({ id });

    if (!beat) {
      throw new NotFoundException(`Beat ${id} not found`);
    }

    if (beat.audioUrl) {
      await this.uploadsService.deleteOldFile(beat.audioUrl);
    }

    const audioPath = `/uploads/audio/${file.filename}`;
    beat.audioUrl = audioPath;
    return await this.beatsRepository.save(beat);
  }
}
