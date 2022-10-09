import { Item } from './item.dto';

export type ItemsDto = {
  Items: {
    ID: string;
    Item: Item[];
  };
};
