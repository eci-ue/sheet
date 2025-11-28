/**
 * @file 单元格填充
 * @author svon.me@gmail.com
 **/

import * as _ from "lodash-es";

const nextLetter = function (str: string = "a", step: number = 1): string {
  if (!/^[A-Za-z]+$/.test(str)) throw new Error("只允许 A-Z 或 a-z 字母组成");

  const isUpper = str === str.toUpperCase();
  const base = isUpper ? 65 : 97; // 'A' 或 'a'

  let arr = str.split("");
  let i = arr.length - 1;

  while (i >= 0) {
    let code = arr[i].charCodeAt(0) - base + step;

    // 关键修复：确保 code 在 0-25 范围内（支持负数）
    step = Math.floor(code / 26);
    if (code < 0) {
      code = ((code % 26) + 26) % 26; // 负数取模正确化
      step -= 1; // 借位
    }

    arr[i] = String.fromCharCode(base + (code % 26));
    i--;

    if (step === 0) break;
  }

  if (step > 0) arr.unshift(...Array(step).fill(String.fromCharCode(base)));
  else if (step < 0) {
    // 如果整体还需要借位，删除前导字母
    // let j = 0;
    while (step < 0 && arr.length > 1) {
      arr.shift();
      step++;
    }
  }

  return arr.join("");
};


export const fillGenerateValue = function (value: string, row: number): string {
  const text = _.trim(value);
  if (/^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(text)) {
    const num = Number(text);
    return String(num + row);
  } else if (/^[a-z]+$/i.test(text)) {
    return nextLetter(text, row);
  } else {
    return value;
  }
}