import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import QuestionTitle from './QuestionTitle';
@Entity('question')
export default class Question {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 255 })
  phoneNumber: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @ManyToOne(() => QuestionTitle)
  @JoinColumn({ name: 'title_id' })
  title: QuestionTitle;

  @Column({ name: 'isRead', type: 'tinyint', default: 1, comment: '0: Inactive, 1: Active.' })
  isRead: boolean;

  @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
  modifiedDate: Date | null;
}
