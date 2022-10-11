import prompt from 'prompt';
import { Service } from 'typedi';
import fs from 'fs/promises';
import path from 'path';

import { consoleRewrite } from '../helpers/console';
import { SearchService } from './search.service';
import { ItemService } from './item.service';
import { example } from '../constants/payload-example';
import { AuthService } from './auth.service';

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

      for (const [title, payload] of Object.entries(example)) {
        const searchResult = await this.searchService.search(payload);

        console.log(`\n✅ ${searchResult.length}개 문제를 찾았습니다! (${title})`);
        consoleRewrite('⏳ 상세정보를 검색하는 중입니다 ...');

        const itemSet: { [k: string]: any } = {};
        for (const { item_id, item_number } of searchResult) {
          const { name, number, answer, groupId, question, explanation, category } =
            await this.itemService.getItemById(item_id);
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
                  number: number || item_number, // 연도에 따른 누락 데이터 처리
                  properties: { name, question, explanation, answer, category },
                  imageUrl: `${process.env.S3_URL || 'https://s3.seodaang.com'}/${title}/q${
                    number || item_number
                  }.png`,
                },
              ],
            };
          } else {
            // groupId 없는 경우 item_id로 처리
            itemSet[groupId || item_id] = {
              type: 'question',
              number: number || item_number, // 연도에 따른 누락 데이터 처리
              properties: { name, question, explanation, answer, category },
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

        // passage 순서로 URL 매핑 (정렬 전에는 별다른 순서 정보가 없기 때문에 여기서 처리)
        let passageNumber = 1;
        groups.forEach((group) => {
          if (group.type === 'passage') {
            group.properties.imageUrl = `${
              process.env.S3_URL || 'https://s3.seodaang.com'
            }/${title}/p${passageNumber++}.png`;
          }
        });

        const dirPath = path.join(__dirname, `../../../dataset/${title}/`);
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(path.join(dirPath, 'result.json'), JSON.stringify(groups));

        consoleRewrite('✅ 상세정보 검색완료');
      }

      console.log('\n\n 👍 모든 작업을 완료하였습니다!');
    } catch (err) {
      console.error(err);
    }
  }
}
