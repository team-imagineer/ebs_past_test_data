export type ItemDto = {
  Item: Item;
};

export type Item = {
  ApplyYear: string;
  GroupID: string;
  ID: string;
  ItemID: string;
  Point: string;
  IsSentence: string;
  SheetName: string;
  ItemIndexes: {
    ItemIndex:
      | {
          // 2015 개정 분류 > 국어 > 독서 > 독서 계획과 활동 > 독서 계획 수립 > 적절한 독서 계획 수립과 독서 실천
          YearName: string;
        }
      | {
          // 2015 개정 분류 > 국어 > 독서 > 독서 계획과 활동 > 독서 계획 수립 > 적절한 독서 계획 수립과 독서 실천
          YearName: string;
        }[];
  };
  LML: {
    Numb: string;
    Seq: string;
    Question: LMLContent;
    Sentence: LMLContent;
  };
};

type LMLContent = {
  Paragraph: Paragraph | Paragraph[];
  List: List;
  Table: Table | Table[];
  Explanation: Explanation | Explanation[];
};

type Paragraph = {
  Run: Run | Run[];
  Table: Table | Table[];
};

type Run = {
  Text: string;
};

type List = {
  ListItem: ListItem[];
};

type ListItem = {
  Paragraph: Paragraph | Paragraph[];
  OriginalSequence: string;
  IsCorrectAnswer: string;
};

type Table = {
  TableRow: TableRow | TableRow[];
};

type TableRow = {
  TableCell: TableCell | TableCell[];
};

type TableCell = {
  Paragraph: Paragraph | Paragraph[];
};

type Explanation = {
  Paragraph: Paragraph | Paragraph[];
};
