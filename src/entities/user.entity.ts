import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn
} from "typeorm";

@Entity()
export class User {
  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

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
