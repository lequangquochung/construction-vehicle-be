import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import Product from './Product';
@Entity('product_gallery')
export default class ProductGallery {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'image', type: 'varchar', length: 255 })
  image: string;

  @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
  modifiedDate: Date | null;
}
