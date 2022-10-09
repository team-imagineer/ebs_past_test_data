import parser from 'xml2json';

export function transformXmlToJson(xml: string) {
  return JSON.parse(parser.toJson(xml));
}
