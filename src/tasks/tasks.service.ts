import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TasksStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { TaskDto } from './dto/task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        task =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return tasks;
  }

  taskNotFound(id) {
    throw new NotFoundException(`Task with id: '${id}' not found`);
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find(task => task.id === id);
    if (!task) this.taskNotFound(id);
    return task;
  }

  createTask(taskDto: TaskDto): Task {
    const { title, description } = taskDto;
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
    const task = this.getTaskById(id);
    if (!task) this.taskNotFound(id);
    this.tasks = this.tasks.filter(item => item.id !== id);
    return task;
  }

  updateTaskStatus(id: string, status: string): any {
    const task = this.getTaskById(id);
    if (!task) this.taskNotFound(id);
    task.status = TasksStatus[status];
    return task;
  }
}
