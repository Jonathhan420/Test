import { Note } from "src/entities/note.entity";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { NoteController } from "./note.controller";
import { NoteService } from "./note.service";

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  providers: [NoteService],
  controllers: [NoteController]
})
export class NoteModule {}
