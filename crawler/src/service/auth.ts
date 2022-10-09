import * as cheerio from 'cheerio';
import { Service } from 'typedi';

import { Client } from '../api/base';

export type LoginInput = {
  username: string;
  password: string;
};

@Service()
export class AuthService {
  constructor(private readonly client: Client) {}

  async authorization(loginInput: LoginInput) {
    try {
      const state = await this.getLoginPageState();
      await this.redirect(loginInput, state);
    } catch (err) {
      console.error(err);
      throw new Error(`❌ 로그인 실패: ${err.message}`);
    }
  }

  /**
   * 로그인을 위해 필요한 hidden state 값을 가져옵니다.
   * @returns state 로그인 페이지 내에 있는 값
   */
  async getLoginPageState(): Promise<string> {
    const response = await this.client.get(process.env.LOGIN_PAGE);
    const $ = cheerio.load(response.body);

    return $('input[name="state"]').attr('value');
  }

  /**
   * 로그인 버튼을 눌렀을 때 일어나는 작업을 mocking합니다.
   */
  async redirect(loginInput: LoginInput, state: string) {
    let $ = await this.client.post$(process.env.AUTH_URL, {
      form: {
        scope: 'openid',
        response_type: 'code',
        redirect_uri: process.env.REDIRECT_URL,
        login: 'true',
        login_uri: process.env.LOGIN_PAGE,
        prompt: 'login',
        client_id: 'ebsi',
        i: loginInput.username,
        c: loginInput.password,
        state,
      },
    });

    // 2. 리다이렉션 2번 처리
    for (let i = 0; i < 2; i++) {
      const actionURL = $('form[id="kc-form-login"]').attr('action');
      $ = await this.client.post$(actionURL);

      await Promise.all(
        $('img')
          .map((_, x) => this.client.get($(x).attr('src')))
          .toArray(),
      );
    }

    // 3. 콜백 URL 처리
    $ = await this.client.get$(process.env.REDIRECT_URL);
    await Promise.all(
      $('img')
        .map((_, x) => this.client.get($(x).attr('src')))
        .toArray(),
    );

    // 4. 로그인 검증
    $ = await this.client.get$(`https://ai.ebs.co.kr/ebs/ai/com/aiIndex.ebs`);
    await Promise.all(
      $('img')
        .map((_, x) => this.client.get($(x).attr('src')))
        .toArray(),
    );

    // 5. 유저 체크
    $ = await this.client.get$(`https://ai.ebs.co.kr/ebs/ai/com/aiIndex.ebs`);
    if (!$('p.login-info').text()) {
      throw new Error('❌ 로그인 실패');
    }
  }
}
