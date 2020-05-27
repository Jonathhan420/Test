import { randomBytes } from "crypto";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { Comment } from "./comment.entity";
import { Note } from "./note.entity";
import { Stats } from "./stats.entity";

@Entity()
export class User {
  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }

  randomMagic() {
    this.magic = randomBytes(4).toString("hex");
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(
    () => Comment,
    comment => comment.location
  )
  comments: Comment[];

  @OneToMany(
    () => Comment,
    comment => comment.author
  )
  authoredComments: Comment[];

  @OneToMany(
    () => Note,
    note => note.location
  )
  notes: Note[];

  @OneToMany(
    () => Note,
    note => note.author
  )
  postedNotes: Note[];

  @Column({ length: 17 })
  steamid: string;

  @Column({ length: 32 })
  name: string;

  @Column({ length: 40 })
  avatar: string;

  @Column()
  private: boolean;

  @OneToMany(
    () => Stats,
    stats => stats.user
  )
  stats: Stats[];

  @Column({ length: 8, default: "magicstr" })
  magic: string;

  @CreateDateColumn({ select: false })
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  error: boolean;
}
