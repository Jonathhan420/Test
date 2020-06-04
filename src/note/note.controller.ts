import { User } from "src/decorators/user.decorator";
import { Payload } from "src/interfaces/jwt/Payload";

import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { SetNoteDto } from "./dto/set-note.dto";
import { NoteService } from "./note.service";

@Controller("note")
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Post("/set")
  @UseGuards(AuthGuard("jwt"))
  async setNote(@Body() setNoteDto: SetNoteDto, @User() { id }: Payload) {
    setNoteDto.author = id;

    return this.noteService.setNote(setNoteDto);
  }
}
