import { Category } from 'src/categories/entities/category.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Beat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  tempo: number;

  @Column({ default: 'beats_placeholder.png' })
  imageUrl: string;

  @Column()
  audioUrl: string;

  @ManyToOne(() => User, user => user.beats)
  user: User;

  @ManyToOne(() => Category, category => category.beats)
  category: Category;

  @OneToMany(() => Transaction, transaction => transaction.beat)
  transactions: Transaction[];

  @OneToMany(() => User, user => user.comments)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
