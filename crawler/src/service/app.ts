import prompt from 'prompt';
import { Service } from 'typedi';

import { consoleRewrite } from '../helpers/console';
import { AuthService } from './auth';

@Service()
export class AppService {
  constructor(private readonly authService: AuthService) {}

  async bootstrap() {
    console.log('🚀 EBS 단추 문제 저장 시작!\n');

    try {
      // authentication
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

      consoleRewrite('⏳ EBS 단추를 불러오는 중입니다 ...');
    } catch (err) {
      console.error(err);
    }
  }
}
