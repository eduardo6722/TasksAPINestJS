import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { TasksStatus } from '../task-status.enum';

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn([TasksStatus.OPEN, TasksStatus.IN_PROGRESS, TasksStatus.DONE])
  status: TasksStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
