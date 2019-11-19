import { TasksStatus } from '../task.model';

export class GetTasksFilterDto {
  status: TasksStatus;
  search: string;
}
