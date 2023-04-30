import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BeatsService } from './beats.service';
import { CreateBeatDto } from './dto/create-beat.dto';
import { UpdateBeatDto } from './dto/update-beat.dto';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';

@Controller('beats')
export class BeatsController {
  constructor(private readonly beatsService: BeatsService) {}

  @Post()
  create(@Body() createBeatDto: CreateBeatDto) {
    return this.beatsService.create(createBeatDto);
  }

  @Get()
  findAll() {
    return this.beatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.beatsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBeatDto: UpdateBeatDto,
  ) {
    return this.beatsService.update(id, updateBeatDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.beatsService.remove(id);
  }

  @Post(':id/comments')
  createComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.beatsService.createComment(id, createCommentDto);
  }

  @Get(':id/comments')
  getComments(@Param('id', ParseIntPipe) id: number) {
    return this.beatsService.getComments(id);
  }
}
