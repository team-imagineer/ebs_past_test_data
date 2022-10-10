import { Service } from 'typedi';
import { has } from 'lodash';

import { ApiService } from '../api';
import { ItemDto } from '../api/dto/item.dto';
import { ItemsDto } from '../api/dto/items.dto';
import { decodeFromBase64 } from '../helpers/b64';
import { transformXmlToJson } from '../helpers/xml';
import { recursiveSearchByField } from '../helpers/util';

@Service()
export class ItemService {
  constructor(private readonly apiService: ApiService) {}

  async getItemById(id: string) {
    const rawBody = await this.apiService.getItemById(id);
    const result = transformXmlToJson(decodeFromBase64(rawBody)) as ItemDto;

    return {
      name: result.Item.SheetName,
      number: result.Item.LML.Numb,
      answer: result.Item.LML.Question.List.ListItem.find((v) => v.IsCorrectAnswer)
        .OriginalSequence,
      point: result.Item.Point,
      groupId: result.Item.GroupID,
      category: Array.isArray(result.Item.ItemIndexes.ItemIndex)
        ? result.Item.ItemIndexes.ItemIndex.map((item) => item.YearName)
        : [result.Item.ItemIndexes.ItemIndex.YearName],
      question:
        (has(result, 'Item.LML.Question.Paragraph') ||
          has(result, 'Item.LML.Question.List') ||
          has(result, 'Item.LML.Question.Table')) &&
        recursiveSearchByField(
          {
            ...result.Item.LML.Question.Paragraph,
            ...result.Item.LML.Question.List,
            ...result.Item.LML.Question.Table,
          },
          'Text',
        ).join(' '),
      explanation:
        has(result, 'Item.LML.Question.Explanation') &&
        recursiveSearchByField(result.Item.LML.Question.Explanation, 'Text').join(' '),
    };
  }

  async getItemsById(id: string) {
    const rawBody = await this.apiService.getItemsById(id);
    const result = transformXmlToJson(decodeFromBase64(rawBody)) as ItemsDto;
    const sentence = result.Items?.Item?.find((item) => has(item, 'LML.Sentence'));

    return {
      passage:
        (has(sentence, 'LML.Sentence.Paragraph') ||
          has(sentence, 'LML.Sentence.List') ||
          has(sentence, 'LML.Sentence.Table')) &&
        recursiveSearchByField(
          {
            ...sentence.LML.Sentence.Paragraph,
            ...sentence.LML.Sentence.List,
            ...sentence.LML.Sentence.Table,
          },
          'Text',
        ).join(' '),
      explanation:
        has(sentence, 'LML.Sentence.Explanation') &&
        recursiveSearchByField(sentence.LML.Sentence.Explanation, 'Text').join(' '),
    };
  }
}
