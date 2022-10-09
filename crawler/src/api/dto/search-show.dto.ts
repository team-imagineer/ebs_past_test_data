import { Item } from './item';

export type SearchShowDto = {
  itemList: {
    status: number;
    reason: string;
    total_value: number;
    item: Item[];
  };
};
