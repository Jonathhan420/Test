import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Comment } from "src/entities/comment.entity";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { JwtStrategy } from "src/auth/jwt.strategy";

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [CommentService, JwtStrategy],
  controllers: [CommentController]
})
export class CommentModule {}
