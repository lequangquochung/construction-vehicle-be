import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Translation from './Translation';
import Category from './Category';
@Entity('product')
export default class Product {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @ManyToOne(() => Translation)
  @JoinColumn({ name: 'name_translation_id' })
  name: Translation;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Translation)
  @JoinColumn({ name: 'description_translation_id' })
  description: Translation;

  @Column({ name: 'model', type: 'varchar', length: 255 })
  model: string;

  @Column({ name: 'contact', type: 'varchar', length: 255 })
  contact: string;

  @Column({ name: 'status', type: 'tinyint', comment: '0: Out of stock, 1: Available.' })
  status: number;

  @Column({ name: 'amount', type: 'int' })
  amount: number | 0;

  @Column({ name: 'price', type: 'numeric', nullable: true })
  price: number;

  @Column({ name: 'image', type: 'varchar', length: 255 })
  image: string;

  @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
  modifiedDate: Date | null;
}
