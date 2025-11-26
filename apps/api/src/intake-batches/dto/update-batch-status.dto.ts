import { IsIn } from 'class-validator';

export class UpdateBatchStatusDto {
  @IsIn(['pending', 'received', 'processing', 'completed'])
  status: string;
}
