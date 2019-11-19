import { Injectable } from '@nestjs/common';
import { Task, TasksStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find(task => task.id === id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TasksStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): any {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1)
      return {
        message: 'Not found!',
      };

    this.tasks.splice(
      this.tasks.findIndex(task => task.id === id),
      1,
    );

    return {
      message: 'Task removed succesfully!',
    };
  }
}
