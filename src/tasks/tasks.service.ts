import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { resolve } from 'dns';
import { TasksStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async createTask(taskDto: TaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(taskDto, user);
  }

  taskNotFound(id: number) {
    throw new NotFoundException(`Task with ID: '${id}' not found`);
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);
    if (!task) this.taskNotFound(id);
    return task;
  }

  async deleteTask(id: number): Promise<{}> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) this.taskNotFound(id);
    return this.successPromiseResponse('Task deleted!');
  }

  async updateTaskStatus(id: number, status: string): Promise<Task> {
    const task: Task = await this.getTaskById(id);
    task.status = TasksStatus[status];
    await task.save();
    return task;
  }

  successPromiseResponse(message: string): Promise<{}> {
    return new Promise(resolve => {
      resolve({
        statusCode: 200,
        message,
      });
    });
  }
}
