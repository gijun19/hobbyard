import { IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsIn(['pending', 'shipped', 'completed'])
  status: string;
}
