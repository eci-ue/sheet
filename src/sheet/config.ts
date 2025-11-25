
import { merge as customMergeCell } from "./merge";

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