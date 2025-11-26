import { IsString } from 'class-validator';

export class AddToBoxDto {
  @IsString()
  buyerId: string;

  @IsString()
  cardId: string;
}
