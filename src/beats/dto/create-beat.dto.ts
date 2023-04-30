import { IsNotEmpty } from 'class-validator';

export class CreateBeatDto {
  @IsNotEmpty()
  readonly title: string;

  readonly description?: string;

  @IsNotEmpty()
  readonly price: number;

  readonly tempo?: number;

  @IsNotEmpty()
  readonly categoryId: number;

  @IsNotEmpty()
  readonly userId: number;
}
