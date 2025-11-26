import { IsString } from 'class-validator';

export class RemoveFromBoxDto {
  @IsString()
  buyerId: string;

  @IsString()
  cardId: string;
}
