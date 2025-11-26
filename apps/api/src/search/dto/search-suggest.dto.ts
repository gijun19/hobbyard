import { IsString, IsOptional, IsIn } from 'class-validator';

export class SearchSuggestDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsIn(['player', 'set', 'all'])
  type?: string;
}
