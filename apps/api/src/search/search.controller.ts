import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchSuggestDto } from './dto/search-suggest.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('suggest')
  suggest(@Query() dto: SearchSuggestDto) {
    return this.searchService.suggest(dto);
  }

  @Get('filter-options')
  getFilterOptions() {
    return this.searchService.getFilterOptions();
  }

  @Get('popular')
  getPopular() {
    return this.searchService.getPopular();
  }
}
