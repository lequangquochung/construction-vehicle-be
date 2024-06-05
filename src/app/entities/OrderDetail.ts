import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Product from './Product';
@Entity('order_detail')
export default class OrderDetail {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 255 })
  phoneNumber: string;

  @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
  modifiedDate: Date | null;
}
