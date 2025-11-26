import { IsString, IsInt, IsOptional, Min, IsIn } from 'class-validator';

export class CreateCardDto {
  @IsOptional()
  @IsString()
  intakeBatchId?: string;

  @IsString()
  sellerId: string;

  @IsIn(['basketball', 'football', 'baseball'])
  category: string;

  @IsString()
  setName: string;

  @IsString()
  playerName: string;

  @IsOptional()
  @IsString()
  teamName?: string;

  @IsOptional()
  @IsString()
  cardNumber?: string;

  @IsOptional()
  @IsString()
  parallel?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  serialNumber?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  serialTotal?: number;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsInt()
  @Min(0)
  priceCents: number;

  @IsOptional()
  @IsString()
  slotLocation?: string;
}
