import { Service } from 'typedi';
import { has } from 'lodash';

import { ApiService } from '../api';
import { ItemDto } from '../api/dto/item.dto';
import { ItemsDto } from '../api/dto/items.dto';
import { decodeFromBase64 } from '../helpers/b64';
import { transformXmlToJson } from '../helpers/xml';

@Service()
export class ItemService {
  constructor(private readonly apiService: ApiService) {}

  async getItemById(id: string): Promise<ItemDto> {
    const rawBody = await this.apiService.getItemById(id);
    const xml = decodeFromBase64(rawBody);

    return transformXmlToJson(xml);
  }

  async getItemsById(id: string): Promise<ItemsDto> {
    const rawBody = await this.apiService.getItemsById(id);
    const xml = decodeFromBase64(rawBody);

    return transformXmlToJson(xml);
  }

  async getSentenceById(id: string) {
    const result = await this.getItemsById(id);
    const items = result.Items.Item;

    return items.find((item) => has(item, 'LML.Sentence'));
  }
}
