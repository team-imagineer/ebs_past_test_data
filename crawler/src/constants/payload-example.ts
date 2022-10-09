import { SUBJECT } from './subject-enum';

export const example = {
  '2021년/11월/3학년/언어와매체': {
    grade: ['3'],
    category: [
      {
        subject: SUBJECT.독서,
        month: '11',
        year: '2021',
      },
      {
        subject: SUBJECT.문학,
        month: '11',
        year: '2021',
      },
      {
        subject: SUBJECT.언어_문법,
        month: '11',
        year: '2021',
      },
      {
        subject: SUBJECT.언어와매체_언어,
        month: '11',
        year: '2021',
      },
      {
        subject: SUBJECT.언어와매체_매체,
        month: '11',
        year: '2021',
      },
    ],
  },
  '2021년/11월/3학년/화법과작문': {
    grade: ['3'],
    category: [
      {
        subject: SUBJECT.독서,
        month: '11',
        year: '2021',
      },
      {
        subject: SUBJECT.문학,
        month: '11',
        year: '2021',
      },
      {
        subject: SUBJECT.화법,
        month: '11',
        year: '2021',
      },
      {
        subject: SUBJECT.작문,
        month: '11',
        year: '2021',
      },
    ],
  },
};
