import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get(':taskId')
  findAll(@Param('taskId') taskId: number) {
    return this.commentsService.findAll(taskId);
  }

  @Get(':taskId/:userId')
  findOne( taskId: number, userId: number) {
    return this.commentsService.findOne(taskId, userId);
  }
  @Patch(':taskId/:userId')
  update(@Param('taskId') taskId: number, @Param('userId') userId: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(taskId, userId, updateCommentDto);
  }

  @Delete(':taskId/:userId')
  remove(@Param('taskId') taskId: number, @Param('userId') userId: number) {
    return this.commentsService.remove(taskId, userId);
  }
}
