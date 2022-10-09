import prompt from 'prompt';
import { Service } from 'typedi';

import { consoleRewrite } from '../helpers/console';
import { SubjectEnum } from '../constants/subject-enum';
import { AuthService } from './auth';
import { SearchService } from './search';

@Service()
export class AppService {
  constructor(
    private readonly authService: AuthService,
    private readonly searchService: SearchService,
  ) {}

  async bootstrap() {
    console.log('🚀 EBS 단추 문제 저장 시작!\n');

    try {
      let input = {
        username: process.env.EBS_USERNAME as string,
        password: process.env.EBS_PASSWORD as string,
      };

      if (!(input.username && input.password)) {
        console.log('✍️ 로그인 정보를 입력하세요.\n');
        prompt.start();
        input = await prompt.get([
          {
            properties: {
              username: { message: 'EBS ID' },
            },
          },
          {
            properties: {
              password: {
                message: 'EBS PASSWORD',
                hidden: true,
              },
            },
          },
        ]);
      }

      consoleRewrite('\n⏳ 로그인 중입니다 ...');
      await this.authService.authorization(input);

      consoleRewrite('\n⏳ 문제를 검색하는 중입니다 ...');
      const result = await this.searchService.search({
        grade: ['1', '2', '3'],
        category: [
          {
            subject: SubjectEnum.독서,
            month: '06',
            year: '2021',
          },
        ],
      });

      console.log(result);
    } catch (err) {
      console.error(err);
    }
  }
}
