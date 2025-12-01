import {ref} from "vue";
import * as _ from "lodash-es";
import {Cell} from "../types/sheet";
import {CellEventName} from "./register";
import * as VTable from "@visactor/vtable";
import safeGet from "@fengqiaogang/safe-get";
import safeSet from "@fengqiaogang/safe-set";
import {CellType, Column} from "../types/sheet";
import {MenuEvent, ToolbarEvent} from "./config";


import type {EmitFn} from "vue";
import type {EditCellData} from "../types/sheet";

export const emitNames = [
  "change", "updateCell", "fillCell",
  "addColumn", "removeColumn", "editColumn", "widthColumn",
  "addRow", "removeRow",
  "move"
];


export const useEvent = function () {
  const sheetRef = ref();
  const getInstance = function () {
    if (sheetRef.value?.vTableInstance) {
      return sheetRef.value.vTableInstance;
    }
  }

  const getSelectedCells = function (): Cell[][] {
    const instance = getInstance();
    if (!instance) {
      return [];
    }
    const list: Cell[][] = [];
    const cells = instance.getSelectedCellInfos();
    for (const array of cells) {
      const rows: Cell[] = [];
      for (const item of array) {
        const value = safeGet<Cell | string | undefined>(item, "value");
        if (_.isNil(value) || _.isString(value) || _.isNumber(value)) {
          const cell = new Cell();
          cell.columnId = safeGet<string>(item, "field")!;
          cell.rowId = safeGet<string>(item, "originData.rowId")!;
          cell.txt = value as string;
          item.value = cell;
        }
        rows.push(item);
      }
      list.push(rows);
    }
    return list;
  }

  const clearSelected = function () {
    const instance = getInstance();
    if (!instance) {
      return [];
    }
    return instance.clearSelected();
  }

  const toolbarClick = function (type: ToolbarEvent, value: string | number | boolean | undefined) {
    const instance = getInstance();
    if (!instance) {
      return;
    }
    const cells: Cell[][] = getSelectedCells();
    if (cells.length < 1) {
      return;
    }
    const list: Cell[] = [];
    for (const item of _.flattenDeep(cells)) {
      let style: object;
      if (type === ToolbarEvent.Clean) {
        style = {};
      } else {
        style = (safeGet<object>(item, "value.style") || safeGet<object>(item, "dataValue.style")) || {};
        if (_.hasIn(style, type)) {
          style = _.omit(style, [type]);
        } else {
          safeSet(style, type, value);
        }
      }
      list.push({
        style,
        column: safeGet<number>(item, "col"),
        row: safeGet<number>(item, "row"),
        columnId: safeGet<string>(item, "field")!,
        rowId: safeGet<string>(item, "originData.rowId")!,
        x1: safeGet<string>(item, "value.x1"),
        x2: safeGet<string>(item, "value.x2"),
        y1: safeGet<string>(item, "value.y1"),
        y2: safeGet<string>(item, "value.y2"),
      });
    }
    instance.fireListeners(CellEventName.Style, list);
  }

  const bindEvent = function ($emit: EmitFn) {
    const instance = getInstance();
    if (!instance) {
      return;
    }
    // 单元格编辑事件
    instance.off(CellEventName.Edit);
    instance.on(CellEventName.Edit, function (list: EditCellData[]) {
      const cells: Cell[] = [];
      for (const item of list) {
        cells.push({
          row: item.row,
          column: item.column,
          ...item.value,
        })
      }
      $emit("updateCell", cells);
    });
    // 单元格样式编辑事件
    instance.off(CellEventName.Style);
    instance.on(CellEventName.Style, function (list: Cell[]) {
      $emit("change", list);
    });

    // 监听列宽调整结束事件
    instance.off(VTable.ListTable.EVENT_TYPE.RESIZE_COLUMN_END)
    instance.on(VTable.ListTable.EVENT_TYPE.RESIZE_COLUMN_END, async function (e: object) {
      const index = safeGet<number>(e, "col") || 0;
      const colWidths = safeGet<number[]>(e, "colWidths") || [];
      if (index < 1) {
        return;
      }
      const width = colWidths[index];
      $emit("widthColumn", {index, width});
    });

    // 移动事件
    instance.off(VTable.ListTable.EVENT_TYPE.CHANGE_HEADER_POSITION)
    instance.on(VTable.ListTable.EVENT_TYPE.CHANGE_HEADER_POSITION, function (event: object) {
      const startX = safeGet<number>(event, "source.col") || 0;
      const endX = safeGet<number>(event, "target.col") || 0;
      const startY = safeGet<number>(event, "source.row") || 0;
      const endY = safeGet<number>(event, "target.row") || 0;
      $emit("move", {startX, endX, startY, endY});
    });


    // 监听右键菜单点击事件
    instance.off(VTable.ListTable.EVENT_TYPE.DROPDOWN_MENU_CLICK);
    instance.on(VTable.ListTable.EVENT_TYPE.DROPDOWN_MENU_CLICK, async function (e: object) {
      const [key, ...args]: string[] = (safeGet<string>(e, "menuKey") || "").split(":");
      // 添加列
      if (key === MenuEvent.addColumn) {
        const direction = Number(args[0] || 1);
        const type = String(args[1] || CellType.text);
        const data = new Column(type as any);
        $emit("addColumn", {
          direction,
          column: data,
          columnId: void 0,
        })
        return;
      }
      // 删除列
      if (key === MenuEvent.removeColumn) {
        const field = safeGet<string>(e, "field");
        if (field) {
          $emit("removeColumn", {columnId: field});
        }
        return;
      }
      // 删除行
      if (key === MenuEvent.removeRow) {
        const cells = getSelectedCells();
        const keys = new Set<string>();
        for (const cell of _.flattenDeep(cells)) {
          const rowId = safeGet<string>(cell, "originData.rowId");
          if (rowId) {
            keys.add(rowId)
          }
        }
        $emit("removeRow", [...keys.values()]);
        return;
      }
      // 编辑列
      if (key === MenuEvent.editColumn) {
        const field = safeGet<string>(e, "field");
        if (field) {
          $emit("editColumn", {columnId: field});
        }
        return;
      }
      // 清空内容
      if (key === MenuEvent.emptyCell) {
        const cells = getSelectedCells();
        const list: Cell[] = [];
        for (const item of _.flattenDeep(cells)) {
          list.push({
            style: {},
            txt: "",
            columnId: safeGet<string>(item, "field")!,
            rowId: safeGet<string>(item, "originData.rowId")!,
            x1: void 0,
            x2: void 0,
            y1: void 0,
            y2: void 0,
          });
        }
        $emit("change", list);
      }
      // 添加行
      if (key === MenuEvent.addRow) {
        const row = safeGet<number>(e, "row");
        const count = Number(args[0] || 1);
        $emit("addRow", {row, count});
        return;
      }
      // 单元格合并
      if (key === MenuEvent.merge) {
        const cells = getSelectedCells();
        const map = new Map<number, Cell[]>();
        for (const tr of cells) {
          for (let index = 0, size = tr.length; index < size; index++) {
            const list: Cell[] = map.get(index) || [];
            let cell = safeGet<Cell>(tr[index], "value")!;
            list.push(cell);
            map.set(index, list);
          }
        }
        const res: Cell[] = [];
        for (const list of map.values()) {
          if (list.length < 1) {
            continue;
          }
          const first = _.first(list)!;
          const last = _.last(list)!;
          let flag: boolean;
          let text: string | undefined;
          if (first.x1 && first.y1) {
            flag = false;
            text = first.txt;
          } else {
            flag = true;
            text = first.txt;
          }
          for (const item of list) {
            item.txt = String(text || "");
            if (flag) {
              item.x1 = first.columnId;
              item.y1 = first.rowId;
              item.x2 = last.columnId;
              item.y2 = last.rowId;
            } else {
              item.x1 = "";
              item.y1 = "";
              item.x2 = "";
              item.y2 = "";
            }
            res.push(item);
          }
        }
        $emit("change", res);
      }
      return;
    });


    // 填充功能
    // 记录 拖拽填充柄之前的选中范围
    let beforeDragMaxCol: number;
    let beforeDragMinCol: number;
    let beforeDragMaxRow: number;
    let beforeDragMinRow: number;
    instance.off(VTable.ListTable.EVENT_TYPE.MOUSEDOWN_FILL_HANDLE);
    instance.on(VTable.ListTable.EVENT_TYPE.MOUSEDOWN_FILL_HANDLE, function () {
      // @ts-ignore
      const startSelectCellRange = instance.getSelectedCellRanges()[0];
      beforeDragMaxCol = Math.max(startSelectCellRange.start.col, startSelectCellRange.end.col);
      beforeDragMinCol = Math.min(startSelectCellRange.start.col, startSelectCellRange.end.col);
      beforeDragMaxRow = Math.max(startSelectCellRange.start.row, startSelectCellRange.end.row);
      beforeDragMinRow = Math.min(startSelectCellRange.start.row, startSelectCellRange.end.row);
    });
    instance.off(VTable.ListTable.EVENT_TYPE.DRAG_FILL_HANDLE_END);
    instance.on(VTable.ListTable.EVENT_TYPE.DRAG_FILL_HANDLE_END, (e: object) => {
      const direction = safeGet<string>(e, "direction")!;
      let startChangeCellCol!: number;
      let startChangeCellRow!: number;
      let endChangeCellCol!: number;
      let endChangeCellRow!: number;
      // @ts-ignore
      const endSelectCellRange = instance.getSelectedCellRanges()[0];
      //根据填充方向 确定需要填充值的范围
      if (direction === 'bottom') {
        startChangeCellCol = beforeDragMinCol;
        startChangeCellRow = beforeDragMaxRow + 1;
        endChangeCellCol = beforeDragMaxCol;
        endChangeCellRow = endSelectCellRange.end.row;
      } else if (direction === 'right') {
        startChangeCellCol = beforeDragMaxCol + 1;
        startChangeCellRow = beforeDragMinRow;
        endChangeCellCol = endSelectCellRange.end.col;
        endChangeCellRow = beforeDragMaxRow;
      } else if (direction === 'top') {
        startChangeCellCol = beforeDragMinCol;
        startChangeCellRow = beforeDragMinRow - 1;
        endChangeCellCol = beforeDragMaxCol;
        endChangeCellRow = endSelectCellRange.end.row;
      } else if (direction === 'left') {
        startChangeCellCol = beforeDragMinCol - 1;
        startChangeCellRow = beforeDragMinRow;
        endChangeCellCol = endSelectCellRange.end.col;
        endChangeCellRow = beforeDragMaxRow;
      }
      return changeTableValues(startChangeCellCol, startChangeCellRow, endChangeCellCol, endChangeCellRow);
    });

    const changeTableValues = function (startChangeCellCol: number, startChangeCellRow: number, endChangeCellCol: number, endChangeCellRow: number) {
      let startRow: number;
      let endRow: number;
      const startCol = Math.min(startChangeCellCol, endChangeCellCol);
      const endCol = Math.max(startChangeCellCol, endChangeCellCol);
      if (startChangeCellRow < endChangeCellRow) {
        startRow = Math.min(startChangeCellRow, endChangeCellRow) - 1;
        endRow = Math.max(startChangeCellRow, endChangeCellRow);
      } else {
        startRow = Math.max(startChangeCellRow, endChangeCellRow) + 1;
        endRow = Math.min(startChangeCellRow, endChangeCellRow);
      }
      // 单元格填充事件
      $emit("fillCell", {startRow, endRow, startCol, endCol});
    }
  }
  return {getSelectedCells, clearSelected, sheetRef, getInstance, bindEvent, toolbarClick};
}