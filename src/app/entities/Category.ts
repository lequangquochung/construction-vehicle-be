import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import Translation from './Translation';
@Entity('category')
export default class Category {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @ManyToOne(() => Translation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'name_translation_id' })
  name: Translation;

  @Column({ name: 'image', type: 'varchar', length: 255 })
  image: string;

  @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
  modifiedDate: Date | null;
}
