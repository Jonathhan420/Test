import { Controller, UseGuards, Post, Body, Put, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { CommentService } from "./comment.service";
import { NewCommentDto } from "./dto/new-comment.dto";
import { User } from "src/decorators/user.decorator";
import { Payload } from "src/interfaces/jwt/Payload";
import { EditCommentDto } from "./dto/edit-comment.dto";

@Controller("comment")
@UseGuards(AuthGuard("jwt"))
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post("new")
  async newComment(@Body() comment: NewCommentDto, @User() { id }: Payload) {
    comment.author = id;
    return this.commentService.newComment(comment);
  }

  @Put(":commentId")
  async editComment(
    @Param("commentId") commentId: string,
    @Body() comment: EditCommentDto,
    @User() { id }: Payload
  ) {
    comment.id = commentId;
    comment.author = id;
    return this.commentService.editComment(comment);
  }
}
