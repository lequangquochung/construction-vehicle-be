import {
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    Column,
  } from 'typeorm';
  @Entity('image')
  export default class Image {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number;
  
    @Column({ name: 'src_image', type: 'varchar', length: 255 })
    srcImage: string;
  
    @Column({ name: 'title', type: 'varchar', length: 255 })
    title: string;

    @Column({ name: 'type', type: 'varchar', length: 255, comment: 'COVER, BACKGROUND_IMAGE' })
    type: string;

    @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
    createdDate: Date;
  
    @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
    modifiedDate: Date | null;
  }
  