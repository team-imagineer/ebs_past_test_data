import { Service } from 'typedi';
import { Client } from './base';
import { SearchShowDto } from './dto/search-show.dto';
import { SearchDto } from './dto/search.dto';

@Service()
export class ApiService {
  constructor(private readonly client: Client) {}

  async search(searchDto: SearchDto): Promise<SearchShowDto> {
    const response = await this.client.post(
      process.env.SEARCH_URL ||
        'https://ai.ebs.co.kr/ebs/ai/xipa/ItemSearchHigh.ajax',
      {
        json: searchDto,
      },
    );

    return JSON.parse(response.body);
  }
}
