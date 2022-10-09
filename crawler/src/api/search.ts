import { AuthSession } from '../service/auth';
import { Client } from './base';

export type SearchBody = {
  is_moc: string;
  item_point: string;
  item_type: string;
  item_num: string;
  del_dupitem_yn: string;
  wrong_rate: string;
  target_cd: string;
  cate_cd_2: string;
};

const searchUrl = 'https://ai.ebs.co.kr/ebs/ai/xipa/ItemSearchHigh.ajax';

export async function search(session: AuthSession) {
  const client = Client.getInstance(session.cookies);

  return client.post(searchUrl, {
    json: {
      is_moc: '0',
      target_cd: '1',
      item_point: '',
      item_type: '1',
      moc_type: '',
      cate_cd_2: '2002730',
      cate_cd_3: '',
      cate_cd_4: '',
      cate_cd_5: '',
      year_start: '2020',
      year_end: '2022',
      item_num: '10',
      del_dupitem_yn: 1,
      wrong_rate: '0',
    },
  });
}
