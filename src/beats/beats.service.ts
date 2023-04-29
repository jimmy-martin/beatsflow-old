import { Injectable } from '@nestjs/common';
import { CreateBeatDto } from './dto/create-beat.dto';
import { UpdateBeatDto } from './dto/update-beat.dto';

@Injectable()
export class BeatsService {
  create(createBeatDto: CreateBeatDto) {
    return 'This action adds a new beat';
  }

  findAll() {
    return `This action returns all beats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} beat`;
  }

  update(id: number, updateBeatDto: UpdateBeatDto) {
    return `This action updates a #${id} beat`;
  }

  remove(id: number) {
    return `This action removes a #${id} beat`;
  }
}
