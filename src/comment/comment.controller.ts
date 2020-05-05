import { Controller, UseGuards, Post, Body } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { CommentService } from "./comment.service";
import { NewCommentDto } from "./dto/new-comment.dto";
import { User } from "src/decorators/user.decorator";
import { Payload } from "src/interfaces/jwt/Payload";

@Controller("comment")
@UseGuards(AuthGuard("jwt"))
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post("new")
  async newComment(@Body() comment: NewCommentDto, @User() payload: Payload) {
    comment.author = payload.id;
    
    return this.commentService.newComment(comment);
  }
}
