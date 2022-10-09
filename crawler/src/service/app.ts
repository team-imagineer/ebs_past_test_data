import prompt from 'prompt';
import { Service } from 'typedi';
import fs from 'fs/promises';
import path from 'path';

import { consoleRewrite } from '../helpers/console';
import { SUBJECT } from '../constants/subject-enum';
import { AuthService } from './auth';
import { SearchService } from './search';
import { ItemService } from './item';

@Service()
export class AppService {
  constructor(
    private readonly authService: AuthService,
    private readonly searchService: SearchService,
    private readonly itemService: ItemService,
  ) {}

  async bootstrap() {
    console.log('🚀 EBS 단추 문제 저장 시작!');

    try {
      let input = {
        username: process.env.EBS_USERNAME as string,
        password: process.env.EBS_PASSWORD as string,
      };

      if (!(input.username && input.password)) {
        console.log('✍️ 로그인 정보를 입력하세요.');
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

      consoleRewrite('⏳ 로그인 중입니다 ...');
      await this.authService.authorization(input);

      consoleRewrite('⏳ 문제를 검색하는 중입니다 ...');
      const searchResult = await this.searchService.search({
        grade: ['1', '2', '3'],
        category: [
          {
            subject: SUBJECT.독서,
            month: '06',
            year: '2021',
          },
        ],
      });

      consoleRewrite('✅ 문제 검색을 완료하였습니다!\n');

      searchResult.forEach(async (data) => {
        const item = await this.itemService.getItemById(data.item_id);
        const sentence = await this.itemService.getSentenceById(data.item_id);

        const dirPath = path.join(__dirname, `../../collect/${data.item_id}/`);

        await fs.mkdir(dirPath, { recursive: true });

        if (item) {
          await fs.writeFile(
            path.join(dirPath, 'item.json'),
            JSON.stringify(item),
          );
        }

        if (sentence) {
          await fs.writeFile(
            path.join(dirPath, 'sentence.json'),
            JSON.stringify(sentence),
          );
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
}
