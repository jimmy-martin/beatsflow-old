import { Beat } from 'src/beats/entities/beat.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => Beat, beat => beat.user)
  beats: Beat[];

  @OneToMany(() => Transaction, transaction => transaction.buyer)
  transactions: Transaction[];

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
