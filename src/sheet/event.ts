import {ref} from "vue";
import * as _ from "lodash-es";
import {MenuEvent} from "./config";
import {CellEventName} from "./register";
import * as VTable from "@visactor/vtable";
import safeGet from "@fengqiaogang/safe-get";
import safeSet from "@fengqiaogang/safe-set";
import {CellType, Column} from "../types/sheet";
import {Cell} from "../types/sheet";


import type {EmitFn} from "vue";
import type {EditCellData} from "../types/sheet";

export const emitNames = [
  "change", "updateCell",
  "addColumn", "removeColumn", "editColumn", "widthColumn",
  "addRow", "removeRow",
  "move"
];

export enum ToolbarEvent {
  Clean = "clean",  // 清除样式
  Bold = "bold",  // 加粗
  Italic = "italic",  // 倾斜
  Through = "through",  // 删除线
  Underline = "underline",  // 下划线
  Font = "font", // 字体演示
  Fill = "fill", // 背景色填充
}

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
    return instance.getSelectedCellInfos();
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
        style = safeGet<object>(item, "value.style") || {};
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
    instance.off(VTable.ListTable.EVENT_TYPE.DROPDOWN_MENU_CLICK)
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
        // 单元格合并
        const map = new Map<number, Cell[]>();
        const cells = getSelectedCells();
        for (const tr of cells) {
          for (let index = 0, size = tr.length; index < size; index++) {
            let cell = safeGet<Cell>(tr[index], "dataValue") || safeGet<Cell>(tr[index], "value");
            if (!cell) {
              cell = new Cell();
              cell.columnId = safeGet<string>(tr[index], "field")!;
              cell.rowId = safeGet<string>(tr[index], "originData.rowId")!;
            }
            const list: Cell[] = map.get(index) || [];
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
    })
  }
  return {getSelectedCells, clearSelected, sheetRef, getInstance, bindEvent, toolbarClick};
}