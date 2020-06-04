import { JwtStrategy } from "src/auth/jwt.strategy";
import { Note } from "src/entities/note.entity";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { NoteController } from "./note.controller";
import { NoteService } from "./note.service";

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  providers: [NoteService, JwtStrategy],
  controllers: [NoteController]
})
export class NoteModule {}
