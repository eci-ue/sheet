/**
 * @file 单元格填充
 * @author svon.me@gmail.com
 **/

import * as _ from "lodash-es";
import {GetCell} from "./config";
import { CellType } from "../types/sheet";
import type {FillCellOption, Column, Row, Cell} from "../types/sheet";

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

export const fillCellCompute = function (option: FillCellOption, columns: Column[] = [], rows: Row[] = []) {
  const list: Cell[] = [];
  if (option.startRow < option.endRow) {
    // 从上往下填充
    for (let row = option.startRow + 1, index = 1; row <= option.endRow; row++, index++) {
      for (let col = option.startCol; col <= option.endCol; col++) {
        const columnIndex = col - 1;
        const column = columns[columnIndex];
        const origin = GetCell(columns, rows, columnIndex, option.startRow - 1);
        const cell = GetCell(columns, rows, columnIndex, row - 1);
        if (cell) {
          if (column.type === CellType.text || column.type === CellType.number) {
            cell.txt = fillGenerateValue(origin?.txt || "", index);
          } else {
            cell.txt = origin?.txt || "";
          }
          list.push(cell);
        }
      }
    }
  } else {
    // 从下往上填充
    for (let row = option.startRow - 1, index = 0; row >= option.endRow; row--, index--) {
      for (let col = option.startCol; col <= option.endCol; col++) {
        const columnIndex = col - 1;
        const column = columns[columnIndex];
        const origin = GetCell(columns, rows, columnIndex, option.startRow - 1);
        const cell = GetCell(columns, rows, columnIndex, row - 1);
        if (cell) {
          if (column.type === CellType.text || column.type === CellType.number) {
            cell.txt = fillGenerateValue(origin?.txt || "", index - 1);
          } else {
            cell.txt = origin?.txt || "";
          }
          list.push(cell);
        }
      }
    }
  }
  return list;
}