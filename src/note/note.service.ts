import { Note } from "src/entities/note.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { SetNoteDto } from "./dto/set-note.dto";

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private noteRepository: Repository<Note>
  ) {}

  private async findOrCreate(noteDto: SetNoteDto) {
    let note: Note;
    try {
      note = await this.noteRepository.findOneOrFail({
        author: new User({ id: noteDto.author }),
        location: new User({ id: noteDto.location })
      });
    } catch {
      note = new Note({
        author: new User({ id: noteDto.author }),
        location: new User({ id: noteDto.location })
      });
    }

    note.content = noteDto.content;
    return note;
  }

  async setNote(noteDto: SetNoteDto) {
    if (!noteDto.location)
      throw new BadRequestException("No location was specified.");

    if (!noteDto.content) {
      return this.noteRepository.delete({
        author: new User({ id: noteDto.author }),
        location: new User({ id: noteDto.location })
      });
    }

    const note = await this.findOrCreate(noteDto);
    return this.noteRepository.save(note);
  }
}
