import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import User from './User';
import OrderDetail from './OrderDetail';
@Entity('order')
export default class Order {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 255,
    comment: 'NEW, CANCELED, PROCESSING, FINISHED',
  })
  status: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 255 })
  phoneNumber: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'total_price', type: 'numeric', nullable: true })
  totalPrice: number | 0;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'isDeleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];

  @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
  modifiedDate: Date | null;
}
