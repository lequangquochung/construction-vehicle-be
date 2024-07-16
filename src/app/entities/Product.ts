import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Translation from './Translation';
import Category from './Category';
@Entity('product')
export default class Product {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @ManyToOne(() => Translation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'name_translation_id' })
  name: Translation;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Translation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'description_translation_id' })
  description: Translation;

  @Column({ name: 'model', type: 'varchar', length: 255 })
  model: string;

  @Column({ name: 'contact', type: 'varchar', length: 255 })
  contact: string;

  @Column({ name: 'status', type: 'varchar', length: 255, comment: 'AVAILABLE, UNAVAILABLE' })
  status: string;

  @Column({ name: 'amount', type: 'int', nullable: true })
  amount: number | 0;

  @Column({ name: 'price', type: 'numeric', nullable: true })
  price: number;

  @Column({ name: 'discount', type: 'numeric', nullable: true })
  discount: number;

  @Column({ name: 'isDiscount', type: 'boolean', default: false })
  isDiscount: boolean;

  @Column({ name: 'image', type: 'varchar', length: 255 })
  image: string;

  @Column({ name: 'type', type: 'varchar', length: 255, nullable: true })
  type: string;

  @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
  modifiedDate: Date | null;
}
