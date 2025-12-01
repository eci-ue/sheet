import * as _ from "lodash-es";
import {ToolbarEvent} from "./event";
import safeGet from "@fengqiaogang/safe-get";
import {Cell, CellType} from "../types/sheet";
import {merge as customMergeCell} from "./merge";

// @ts-ignore
import AddColumnIcon from "./icon/plus.svg";
// @ts-ignore
import UploadIcon from "./icon/upload.svg";
// @ts-ignore
import AutoIcon from "./icon/default.svg";
// @ts-ignore
import DocIcon from "./icon/docx.svg";
// @ts-ignore
import ImageIcon from "./icon/jpg.svg";
// @ts-ignore
import MusicIcon from "./icon/music.svg";
// @ts-ignore
import VideoIcon from "./icon/video.svg";
// @ts-ignore
import ZipIcon from "./icon/zip.svg";

import type {ContextMenu} from "../types/prop";
import type {Column, Row} from "../types/sheet";

export const Icon = {
  plus: AddColumnIcon,
  upload: UploadIcon,
  auto: AutoIcon,
  zip: ZipIcon,
  video: VideoIcon,
  image: ImageIcon,
  music: MusicIcon,
  doc: DocIcon,
}

export const getColumnMenu = function () {
  return [
    {key: CellType.text, value: "Text"},
    {key: CellType.number, value: "Number"},
  ];
}

export enum MenuEvent {
  addColumn = "add-column",
  addRow = "add-row",
  editColumn = "edit-column", // 编辑列 - 标题数据
  removeColumn = "remove-column", // 删除列
  removeRow = "remove-row", // 删除行
  emptyCell = "empty-cell", // 删除单元格数据
  merge = "merge",
}

export const SheetMenuConfig = function (sheetId: number | string | undefined, disabled: boolean, field: string, row: number, col: number): object[] | undefined {
  if (disabled) {
    return [];
  }
  const menus = getColumnMenu();
  // 只在数据行显示菜单，不在表头显示
  if (row === 0) {
    if (col > 0) {
      let list: object[];
      if (field === "add_column") {
        list = _.map(menus, function (item) {
          return {text: item.value, menuKey: `${MenuEvent.addColumn}:1:${item.key}`, field};
        });
      } else {
        list = [
          {text: "Edit column", menuKey: MenuEvent.editColumn, field, row, col},
          {text: "Delete column", menuKey: MenuEvent.removeColumn, field, row, col},
          {
            text: "Insert column left",
            menuKey: MenuEvent.addColumn,
            children: _.map(menus, function (item) {
              return {text: item.value, menuKey: `${MenuEvent.addColumn}:-1:${item.key}`, field};
            })
          },
          {
            text: "Insert column right",
            menuKey: MenuEvent.addColumn,
            children: _.map(menus, function (item) {
              return {text: item.value, menuKey: `${MenuEvent.addColumn}:1:${item.key}`, field};
            })
          }
        ];
      }
      return list
    }
    return [];
  }
  if (col === 0) {
    return [
      {text: "Delete row", menuKey: MenuEvent.removeRow, field, row, col},
      {
        text: "Insert row above", menuKey: MenuEvent.addRow, field, row, col,
        children: [
          {text: "1 row", menuKey: `${MenuEvent.addRow}:-1`, field, row, col},
          {text: "5 rows", menuKey: `${MenuEvent.addRow}:-5`, field, row, col,},
          {text: "10 rows", menuKey: `${MenuEvent.addRow}:-10`, field, row, col,},
          {text: "20 rows", menuKey: `${MenuEvent.addRow}:-20`, field, row, col,},
          {text: "50 rows", menuKey: `${MenuEvent.addRow}:-50`, field, row, col,},
          {text: "100 rows", menuKey: `${MenuEvent.addRow}:-100`, field, row, col,},
          {text: "200 rows", menuKey: `${MenuEvent.addRow}:-200`, field, row, col,},
        ]
      },
      {
        text: "Insert row below", menuKey: `${MenuEvent.addRow}:1`, field, row, col,
        children: [
          {text: "1 row", menuKey: `${MenuEvent.addRow}:1`, field, row, col},
          {text: "5 rows", menuKey: `${MenuEvent.addRow}:5`, field, row, col,},
          {text: "10 rows", menuKey: `${MenuEvent.addRow}:10`, field, row, col,},
          {text: "20 rows", menuKey: `${MenuEvent.addRow}:20`, field, row, col,},
          {text: "50 rows", menuKey: `${MenuEvent.addRow}:50`, field, row, col,},
          {text: "100 rows", menuKey: `${MenuEvent.addRow}:100`, field, row, col,},
          {text: "200 rows", menuKey: `${MenuEvent.addRow}:200`, field, row, col,},
        ]
      },
    ]
  }
  return [
    // 清空内容
    {text: "Clear Contents", menuKey: MenuEvent.emptyCell, field, row, col},
    // 垂直合并
    {text: "Merge Vertically", menuKey: MenuEvent.merge, field, row, col},
  ]
}

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
        let value: object[] | undefined;
        if (contextMenu) {
          value = contextMenu(sheetId, disabled, field, row, col);
        } else {
          value = SheetMenuConfig(sheetId, disabled, field, row, col);
        }
        return value ? value : [];
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

export const GetCell = function (columns: Column[] = [], rows: Row[] = [], columnIndex: number, rowIndex: number): Cell | undefined {
  const column = columns[columnIndex];
  const row = rows[rowIndex];
  if (!column || !row) {
    return void 0;
  }
  const cell = safeGet<Cell>(row, column.columnId);
  if (cell) {
    return cell;
  } else {
    const data = new Cell();
    data.rowId = row.rowId;
    data.columnId = column.columnId;
    return data;
  }
}