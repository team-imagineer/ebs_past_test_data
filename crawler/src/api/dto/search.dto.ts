export type SearchDto = {
  is_moc: string;
  target_cd: string;
  cate_cd_2: string;
  item_point: string;
  item_type: string;
  item_num: string;
  del_dupitem_yn: number;
  wrong_rate: string;
  previous_questions: {
    cate_cd_2: string;
    month: string;
    year: string;
  }[];
};
