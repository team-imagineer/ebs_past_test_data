import * as cheerio from 'cheerio';
import got, { Got, OptionsOfTextResponseBody } from 'got';
import { CookieJar } from 'tough-cookie';
import { Service } from 'typedi';

@Service()
export class Client {
  private readonly fetcher: Got;

  constructor() {
    const cookieJar = new CookieJar();
    this.fetcher = got.extend({ cookieJar });
  }

  public get(url: string, options?: OptionsOfTextResponseBody | undefined) {
    return this.fetcher.get(url, options);
  }

  public post(url: string, options?: OptionsOfTextResponseBody | undefined) {
    return this.fetcher.post(url, options);
  }

  public async get$(url: string, options?: OptionsOfTextResponseBody | undefined) {
    const response = await this.get(url, options);
    return cheerio.load(response.body);
  }

  public async post$(url: string, options?: OptionsOfTextResponseBody | undefined) {
    const response = await this.post(url, options);
    return cheerio.load(response.body);
  }
}
