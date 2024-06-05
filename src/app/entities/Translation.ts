import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
@Entity('translation')
export default class Translation {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'content_eng', type: 'varchar', length: 255 })
  contentEng: string;

  @Column({ name: 'content_vie', type: 'varchar', length: 255 })
  contentVie: string;

  @Column({ name: 'memo', type: 'varchar', length: 255 })
  memo: string;

  @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
  modifiedDate: Date | null;
}
