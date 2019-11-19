import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    // @Body('title') title: string,
    // @Body('description') description: string,
  ): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string): any {
    return this.tasksService.deleteTask(id);
  }
}
