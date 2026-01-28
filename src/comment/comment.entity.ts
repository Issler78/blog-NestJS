import { ArticleEntity } from '../article/article.entity';
import { UserEntity } from '../user/user.entity';
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  
  @Column()
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.comments, { eager: true })
  author: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.comments)
  article?: ArticleEntity;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }
}
