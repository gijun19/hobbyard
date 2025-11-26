import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryCardsDto {
  @IsOptional()
  @IsIn(['basketball', 'football', 'baseball'])
  category?: string;

  @IsOptional()
  @IsString()
  playerName?: string;

  @IsOptional()
  @IsString()
  setName?: string;

  @IsOptional()
  @IsString()
  parallel?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsIn(['active', 'reserved', 'sold'])
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number;
}
