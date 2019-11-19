import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TasksStatus } from './task.model';
import { TaskDto } from './dto/task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    if (!Object.keys(filterDto).length) return this.tasksService.getAllTasks();
    return this.tasksService.getTasksWithFilter(filterDto);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() taskDto: TaskDto,
    // @Body('title') title: string,
    // @Body('description') description: string,
  ): Task {
    return this.tasksService.createTask(taskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string): any {
    return this.tasksService.deleteTask(id);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Task {
    return this.tasksService.updateTaskStatus(id, TasksStatus[status]);
  }
}
