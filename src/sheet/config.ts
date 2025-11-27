
import {ToolbarEvent} from "./event";
import safeGet from "@fengqiaogang/safe-get";
import { merge as customMergeCell } from "./merge";

import type { Cell } from "../types/sheet";
import type { ContextMenu } from "../types/prop";

export const SheetConfig = function (sheetId?: number | string, disabled: boolean = false, contextMenu?: ContextMenu): object {
  return {
    sheetId,
    widthMode: 'standard',
    heightMode: "autoHeight",
    // heightMode: 'standard',
    defaultRowHeight: 60,
    autoFillHeight: false,
    heightAdaptiveMode: "all",
    autoHeightInAdaptiveMode: true,
    maxCharactersNumber: 1000,
    enableLineBreak: true,
    autoWrapText: true,
    // limitMaxAutoWidth: 600,
    editCellTrigger: 'doubleclick',
    // editCellTrigger: 'click',
    keyboardOptions: {
      copySelected: false,
      pasteValueToCell: false,
      selectAllOnCtrlA: false
    },
    customConfig: {
      createReactContainer: true,
    },
    frozenColCount: 1,
    rightFrozenColCount: disabled ? 2 : 0,
    dragOrder: {
      dragHeaderMode: disabled ? 'none' : 'all',
      // validateDragOrderOnEnd(source, target) {
      //   console.log(source, target);
      //   return true;
      // }
    },
    rowSeriesNumber: {
      title: "No.",
      dragOrder: !disabled,
      width: 85,
      disableColumnResize: false,
      cellType: 'text',
      style: {
        autoWrapText: false,
      }
    },
    excelOptions: {
      fillHandle: true
    },
    customMergeCell,
    menu: {
      // 单元格右键菜单
      contextMenuItems: function (field: string, row: number, col: number) {
        if (contextMenu) {
          return contextMenu(field, row, col) || [];
        }
        return [];
      },
    },
  }
}

export const StyleValue = function (columnId: string, record: object, type: ToolbarEvent): string | number | boolean | undefined {
  const cell = safeGet<Cell>(record, columnId);
  if (!cell) {
    return void 0;
  }
  let style: string | number | boolean | undefined;
  if (cell.style) {
    const value = safeGet<string | number | boolean>(cell.style, type);
    if (value) {
      switch (type) {
        case ToolbarEvent.Bold:       // 加粗
          style = 700;
          break;
        case ToolbarEvent.Through:    // 中横线
        case ToolbarEvent.Underline:  // 下划线
          style = value;
          break;
        case ToolbarEvent.Italic:     // 倾斜
          style = "italic";
          break;
        case ToolbarEvent.Font:       // 字体颜色
          style = value || "black";
          break;
        case ToolbarEvent.Fill:       // 背景颜色
          style = value;
          break;
      }
    }
  }
  return style;
}