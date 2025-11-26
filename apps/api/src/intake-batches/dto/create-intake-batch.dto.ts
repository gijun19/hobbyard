import { IsString } from 'class-validator';

export class CreateIntakeBatchDto {
  @IsString()
  sellerId: string;
}
