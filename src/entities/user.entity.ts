import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany
} from "typeorm";
import { Comment } from "./comment.entity";

@Entity()
export class User {
  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(() => Comment, comment => comment.location)
  comments: Comment[];

  @OneToMany(() => Comment, comment => comment.author)
  authoredComments: Comment[];

  @Column({ length: 17 })
  steamid: string;

  @Column({ length: 32 })
  name: string;

  @Column({ length: 40 })
  avatar: string;

  @Column()
  private: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
