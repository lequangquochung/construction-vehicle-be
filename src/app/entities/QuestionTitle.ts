import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
  } from 'typeorm';
  @Entity('question_title')
  export default class QuestionTitle {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number;
  
    @Column({ name: 'content_vi', type: 'text' })
    contentVi: string;
  
    @Column({ name: 'content_en', type: 'text' })
    contentEn: string;
  
    @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
    createdDate: Date;
  
    @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
    modifiedDate: Date | null;
  }
  