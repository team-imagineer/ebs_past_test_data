import { Service } from 'typedi';

import { ApiService } from '../api';
import { SearchRequestDto } from '../api/dto/search-request.dto';

export type SearchPayload = {
  grade: string[];
  category: {
    subject: string;
    year: string;
    month: string;
  }[];
};

const defaultDto = {
  is_moc: '1',
  target_cd: '3',
  cate_cd_2: '2002730',
  item_point: '1,2,3,4',
  item_type: '1',
  previous_questions: [
    {
      cate_cd_2: '2002730',
      month: '06',
      year: '2021',
    },
  ],
  item_num: '100',
  del_dupitem_yn: 1,
  wrong_rate: '0',
};

@Service()
export class SearchService {
  constructor(private readonly apiService: ApiService) {}

  async search(payload: SearchPayload) {
    try {
      const dto: SearchRequestDto = {
        ...defaultDto,
        target_cd: payload.grade.join(','),
        cate_cd_2: payload.category.map((c) => c.subject).join(','),
        previous_questions: payload.category.map((c) => ({
          cate_cd_2: c.subject,
          month: c.month,
          year: c.year,
        })),
      };
      const result = await this.apiService.search(dto);

      return result.itemList.item;
    } catch (err) {
      console.error(err);
      throw new Error(`❌ 검색 실패: ${err.message}`);
    }
  }
}
