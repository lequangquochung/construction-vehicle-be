import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from './User';
@Entity('order')
export default class Order {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'status',
    type: 'tinyint',
    comment: '0: New, 1: Accept, 2: Cancel, 3: Finished.',
  })
  status: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 255 })
  phoneNumber: string;

  @Column({ name: 'total_price', type: 'numeric' })
  totalPrice: number | 0;

  @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
  modifiedDate: Date | null;
}
