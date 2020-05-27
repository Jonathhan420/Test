import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user.entity";

@Entity()
export class Note {
  constructor(note: Partial<Note>) {
    Object.assign(this, note);
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(
    () => User,
    user => user.postedNotes
  )
  author: User;

  @ManyToOne(
    () => User,
    user => user.notes
  )
  location: User;

  @Column("text")
  content: string;
}
