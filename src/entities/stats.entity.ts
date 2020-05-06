import { Entity, ManyToOne, CreateDateColumn, Column } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Stats {
  constructor(stats: Partial<Stats>) {
    Object.assign(this, stats);
  }

  @ManyToOne(
    () => User,
    user => user.stats
  )
  user: User;

  @Column({
    type: "mediumint",
    unsigned: true
  })
  robots: number;

  @Column({
    type: "smallint",
    unsigned: true,
    default: 0
  })
  tours_ST: number;

  @Column({
    type: "tinyint",
    unsigned: true,
    default: 0
  })
  progress_ST: number;

  @Column({
    type: "smallint",
    unsigned: true,
    default: 0
  })
  tours_OS: number;

  @Column({
    type: "tinyint",
    unsigned: true,
    default: 0
  })
  progress_OS: number;

  @Column({
    type: "smallint",
    unsigned: true,
    default: 0
  })
  tours_GG: number;

  @Column({
    type: "tinyint",
    unsigned: true,
    default: 0
  })
  progress_GG: number;

  @Column({
    type: "smallint",
    unsigned: true,
    default: 0
  })
  tours_ME: number;

  @Column({
    type: "tinyint",
    unsigned: true,
    default: 0
  })
  progress_ME: number;

  @Column({
    type: "smallint",
    unsigned: true,
    default: 0
  })
  tours_TC: number;

  @Column({
    type: "tinyint",
    unsigned: true,
    default: 0
  })
  progress_TC: number;

  @CreateDateColumn()
  time: Date;
}
