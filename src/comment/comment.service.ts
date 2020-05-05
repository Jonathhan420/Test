import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { NewCommentDto } from "./dto/new-comment.dto";
import { Comment } from "src/entities/comment.entity";
import { User } from "src/entities/user.entity";

@Injectable()
export class CommentService {
  constructor(@InjectRepository(Comment) private commentRepo: Repository<Comment>) {}

  async newComment(commentDto: NewCommentDto) {
    const { content } = commentDto;

    if (!commentDto.location) throw new BadRequestException("Comment location is missing.");
    else if (!content) throw new BadRequestException("Comment content is missing.");
    else if (content.length < 4) throw new BadRequestException("Comment content must be at least 4 characters");
    else if (content.length > 2048) throw new BadRequestException("Comment content must be at most 2048 chracters.");

    const comment = new Comment({
      author: new User({ id: commentDto.author }),
      location: new User({ id: commentDto.location }),
      content
    });

    return this.commentRepo.save(comment);
  }
}
