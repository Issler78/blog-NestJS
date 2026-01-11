import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tags' }) // table name
export class TagEntity {
  // model with columns
  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
