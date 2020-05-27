import { Comment } from "src/entities/comment.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { DeleteCommentDto } from "./dto/delete-comment.dto";
import { EditCommentDto } from "./dto/edit-comment.dto";
import { NewCommentDto } from "./dto/new-comment.dto";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>
  ) {}

  private verifyContent(content: string) {
    if (!content) throw new BadRequestException("Comment content is missing.");
    else if (content.length < 4)
      throw new BadRequestException(
        "Comment content must be at least 4 characters"
      );
    else if (content.length > 2048)
      throw new BadRequestException(
        "Comment content must be at most 2048 chracters."
      );
  }

  async newComment(commentDto: NewCommentDto) {
    if (!commentDto.location)
      throw new BadRequestException("Comment location is missing.");
    this.verifyContent(commentDto.content);

    const comment = new Comment({
      author: new User({ id: commentDto.author }),
      location: new User({ id: commentDto.location }),
      content: commentDto.content
    });

    return this.commentRepo.save(comment);
  }

  async editComment(commentDto: EditCommentDto) {
    let comment: Comment;

    try {
      comment = await this.commentRepo.findOneOrFail({
        relations: ["author"],
        where: {
          id: commentDto.id
        }
      });
    } catch {
      throw new NotFoundException("Comment doesn't exist or was deleted.");
    }

    if (comment.author.id !== commentDto.author)
      throw new UnauthorizedException(
        "Only the author can edit their comment."
      );

    this.verifyContent(commentDto.content);

    comment.content = commentDto.content;

    return this.commentRepo.save(comment);
  }

  async deleteComment(commentDto: DeleteCommentDto) {
    let comment: Comment;

    try {
      comment = await this.commentRepo.findOneOrFail({
        relations: ["author"],
        where: {
          id: commentDto.id
        }
      });
    } catch {
      throw new NotFoundException(
        "Comment doesn't exist or was already deleted."
      );
    }

    if (comment.author.id !== commentDto.author)
      throw new UnauthorizedException(
        "Only the author can delete their comment."
      );

    await this.commentRepo.remove(comment);
    return;
  }
}
