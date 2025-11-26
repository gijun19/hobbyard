import { IsString, IsInt, IsOptional, Min, IsIn } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsIn(['basketball', 'football', 'baseball'])
  category?: string;

  @IsOptional()
  @IsString()
  setName?: string;

  @IsOptional()
  @IsString()
  playerName?: string;

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

  @IsOptional()
  @IsInt()
  @Min(0)
  priceCents?: number;

  @IsOptional()
  @IsString()
  slotLocation?: string;

  @IsOptional()
  @IsIn(['active', 'reserved', 'sold'])
  status?: string;
}
