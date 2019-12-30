import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskDto } from './dto/task.dto';
import { TasksStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(taskDto: TaskDto, user: User): Promise<Task> {
    const { title, description } = taskDto;
    const task = new Task();

    task.title = title;
    task.description = description;
    task.status = TasksStatus.OPEN;
    task.user = user;
    await task.save();

    delete task.user;

    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { search, status } = filterDto;
    const query = this.createQueryBuilder('task');

    query.andWhere('task.userId = :userId', { userId: user.id });

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (status) {
      query.andWhere('task.status = :status', { status: TasksStatus[status] });
    }

    const tasks = await query.getMany();
    return tasks;
  }
}
