/**
 * @file 单元格合并
 * @author svon.me@gmail.com
 **/

import * as _ from "lodash-es";
import safeGet from "@fengqiaogang/safe-get";

import {Column, Row, Cell} from "../types/sheet";

const getColumn = function (table: object, index: number): Column | undefined {
  const list = safeGet<Column[]>(table, "options.columns") || [];
  return list[index];
}

const getRow = function (table: object, index: number): Row | undefined {
  const list = safeGet<Row[]>(table, "options.records") || [];
  return list[index];
}

const getColumnIndex = function (table: object, columnId: string): number {
  let index = 0;
  const list = safeGet<Column[]>(table, "options.columns") || [];
  for (let size = _.size(list); index < size; index++) {
    const item = list[index];
    const key = safeGet<string>(item, "field") || safeGet<string>(item, "columnId");
    if (key && key === columnId) {
      break;
    }
  }
  return index;
}

const getRowIndex = function (table: object, rowId: string): number {
  let index = 0;
  const list = safeGet<Row[]>(table, "options.records") || [];
  for (let size = _.size(list); index < size; index++) {
    const item = list[index];
    const key = safeGet<string>(item, "rowId");
    if (key && key === rowId) {
      break;
    }
  }
  return index;
}

const getCell = function (table: object, col: number, row: number): Cell | undefined {
  const columnData = getColumn(table, col);
  const rowData = getRow(table, row);
  if (columnData && rowData) {
    const columnId = columnData.columnId || safeGet<string>(columnData, "field");
    if (columnId) {
      const cell = safeGet<Cell>(rowData, `${columnId}_cell`);
      if (cell) {
        return cell;
      }
      const data = new Cell();
      data.columnId = columnId;
      data.rowId = rowData.rowId;
      data.txt = safeGet<string>(rowData, columnId);
      return data;
    }
  }
}


const mergeConfig = function (cell: Cell, table: object) {
  const x1 = getColumnIndex(table, cell.x1!);
  const y1 = getRowIndex(table, cell.y1!);

  const x2 = getColumnIndex(table, cell.x2!);
  const y2 = getRowIndex(table, cell.y2!);

  return {
    text: cell.txt,
    range: {
      start: {
        col: x1 + 1,
        row: y1 + 1,
      },
      end: {
        col: x2 + 1,
        row: y2 + 1,
      }
    },
  };
}

const customMergeCell = function (columnIndex: number, rowIndex: number, table: object) {
  const cell = getCell(table, columnIndex, rowIndex);
  if (cell && cell.x1 && cell.y1 && cell.x2 && cell.y2) {
    return mergeConfig(cell, table);
  }
}

export const merge = function (columnIndex: number, rowIndex: number, table: object) {
  if (columnIndex > 0 && rowIndex > 0) {
    return customMergeCell(columnIndex - 1, rowIndex - 1, table);
  }
}