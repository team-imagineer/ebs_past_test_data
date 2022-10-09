import { Service } from 'typedi';

import { Client } from './base';
import { SearchDto } from './dto/search.dto';
import { SearchRequestDto } from './dto/search-request.dto';

@Service()
export class ApiService {
  constructor(private readonly client: Client) {}

  async search(searchRequestDto: SearchRequestDto): Promise<SearchDto> {
    const response = await this.client.post(
      process.env.SEARCH_URL || 'https://ai.ebs.co.kr/ebs/ai/xipa/ItemSearchHigh.ajax',
      {
        json: searchRequestDto,
      },
    );

    return JSON.parse(response.body);
  }

  async getItemById(id: string): Promise<string> {
    const response = await this.client.get(
      process.env.ITEM_URL || 'https://ai.ebs.co.kr/ebs/xip/webservice/Item.ebs',
      {
        searchParams: new URLSearchParams([
          ['Action', 'Select'],
          ['itemId', id],
          ['site', 'HSC'],
          ['IsEncrypt', 'false'],
        ]),
      },
    );

    return response.body;
  }

  async getItemsById(id: string): Promise<string> {
    const response = await this.client.get(
      process.env.ITEM_URL || 'https://ai.ebs.co.kr/ebs/xip/webservice/Items.ebs',
      {
        searchParams: new URLSearchParams([
          ['Action', 'SelectGroup'],
          ['itemId', id],
          ['site', 'HSC'],
          ['IsEncrypt', 'false'],
        ]),
      },
    );

    return response.body;
  }
}
