import prompt from 'prompt';
import { Service } from 'typedi';
import fs from 'fs/promises';
import path from 'path';

import { consoleRewrite } from '../helpers/console';
import { AuthService } from './auth';
import { SearchService } from './search';
import { ItemService } from './item';
import { example } from '../constants/payload-example';

@Service()
export class AppService {
  constructor(
    private readonly authService: AuthService,
    private readonly searchService: SearchService,
    private readonly itemService: ItemService,
  ) {}

  async bootstrap() {
    console.log('🚀 EBS 단추 문제 크롤링 시작!');

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

      for (const [name, payload] of Object.entries(example)) {
        consoleRewrite('⏳ 주어진 정보로 문제를 검색하는 중입니다 ...');

        const searchResult = await this.searchService.search(payload);

        consoleRewrite(`✅ ${searchResult.length}개 문제의 검색을 완료하였습니다! (${name}) \n`);
        consoleRewrite('⏳ 문제 상세정보를 검색하는 중입니다 ...\n');

        const itemSet: { [k: string]: any } = {};
        for (const { item_id } of searchResult) {
          const { number, groupId, question, explanation } = await this.itemService.getItemById(
            item_id,
          );
          const { passage, explanation: passageExplanation } = await this.itemService.getItemsById(
            item_id,
          );

          if (!(groupId in itemSet)) {
            itemSet[groupId] = { type: null, properties: {}, children: [] };
          }

          if (passage) {
            itemSet[groupId] = {
              ...itemSet[groupId],
              type: 'passage',
              properties: { passage, explanation: passageExplanation },
              children: [
                ...itemSet[groupId].children,
                {
                  type: 'question',
                  number: number,
                  properties: { question, explanation },
                },
              ],
            };
          } else {
            // groupId 없는 경우 item_id로 처리
            itemSet[groupId || item_id] = {
              type: 'question',
              number: number,
              properties: { question, explanation },
            };
          }
        }

        const groups = Object.values(itemSet);
        // 내부 정렬
        groups
          .filter((group) => group.type === 'passage')
          .forEach((group) => group.children.sort((a, b) => +a.number - +b.number));

        // 전체 정렬
        groups.sort((a, b) => {
          const p = a.type === 'passage' ? +a.children[0].number : +a.number;
          const q = b.type === 'passage' ? +b.children[0].number : +b.number;
          return p - q;
        });

        const dirPath = path.join(__dirname, `../../dataset/${name}/`);
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(path.join(dirPath, 'result.json'), JSON.stringify(groups));
      }

      consoleRewrite('✅ 모든 작업을 완료하였습니다!\n');
    } catch (err) {
      console.error(err);
    }
  }
}
