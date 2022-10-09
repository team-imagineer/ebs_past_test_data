export function recursiveSearchByField(obj: Object, targetField: string): string[] {
  let result = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key === targetField) {
      result.push(value);
    } else {
      if (typeof value === 'object') {
        result = result.concat(recursiveSearchByField(value, targetField));
      }

      if (Array.isArray(value)) {
        value.forEach((v) => {
          result = result.concat(recursiveSearchByField(v, targetField));
        });
      }
    }
  }

  return result.map((v) => transformMultipleSpaceToSingle(v));
}

function transformMultipleSpaceToSingle(str: string) {
  while (str.indexOf('  ') !== -1) {
    str = str.replace(/  /g, ' ');
  }

  return str;
}
