import {ref} from "vue";
import * as _ from "lodash-es";
import {CellEventName} from "./register";
import safeGet from "@fengqiaogang/safe-get";
import safeSet from "@fengqiaogang/safe-set";


import type {EmitFn} from "vue";
import type {Cell} from "../types/sheet";
import type {EditCellData} from "../types/sheet";

export const emitNames = ["change", "addColumn"];

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

  const toolbarClick = function (type: ToolbarEvent, value: string | number | boolean | undefined) {
    const instance = getInstance();
    if (!instance) {
      return;
    }
    const cells: Cell[][] = instance.getSelectedCellInfos();
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
    instance.on(CellEventName.Edit, function (list: EditCellData[]) {
      const cells: Cell[] = [];
      for (const item of list) {
        cells.push({
          row: item.row,
          column: item.column,
          ...item.value,
          sheetId: item.sheetId,
        })
      }
      $emit("change", cells);
    });
    instance.on(CellEventName.Style, function (list: Cell[]) {
      $emit("change", list);
    });
  }

  return {sheetRef, getInstance, bindEvent, toolbarClick};
}