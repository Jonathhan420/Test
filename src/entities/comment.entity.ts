import {
  Entity,
  Column,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Comment {
  constructor(comment: Partial<Comment>) {
    Object.assign(this, comment);
  }

  @ManyToOne(
    () => User,
    user => user.authoredComments
  )
  author: User;

  @ManyToOne(
    () => User,
    user => user.comments
  )
  location: User;

  @Column("text")
  content: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
