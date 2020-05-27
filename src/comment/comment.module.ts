import { JwtStrategy } from "src/auth/jwt.strategy";
import { Comment } from "src/entities/comment.entity";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [CommentService, JwtStrategy],
  controllers: [CommentController]
})
export class CommentModule {}
