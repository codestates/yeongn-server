import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchServie: SearchService) {}

  @Get('/:query')
  search(@Param('query') query: string) {
    return this.searchServie.search(query);
  }
}
