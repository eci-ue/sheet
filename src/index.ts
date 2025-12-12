/**
 * @file Sheet
 * @author svon.me@gmail.com
 */

export {useEvent} from "./sheet/event";
export {default as Toolbar} from "./toolbar.vue";
export {merge as CellMerge} from "./sheet/merge";
export {CellType, OptionKV, Column, Cell, EditCellData} from "./types/sheet";
export {fillGenerateValue as fillGenerate, fillCellCompute} from "./sheet/fill";
export {StyleValue, Style as CellStyle, format as fieldFormat} from "./sheet/cell";
export {SheetConfig, MenuEvent, GetCell, isReadOnly, getColumnMenu, addColumnKey, SheetMenuConfig} from "./sheet/config";
export {
  CellEventName,
  SetCellView,
  GetCellView,
  HasCellView,
  RegisterCell,
  RemoveCellView,
  makeCellEditorName,
  init as RegisterInit
} from "./sheet/register";

export {default as VueEditor} from "./sheet/vue";
export {default as NumberEditor} from "./sheet/widgets/number";
export {Editor as TextEditor} from "./sheet/widgets/text/editor";

export {default as Sheet} from "./sheet/sheet.vue";

export * as dom from "./util/dom";
export * as preview from "./util/preview";

export type {ColumnList, RowList, ContextMenu} from "./types/prop";
export type {Row, RowBasis, RowCells, FillCellOption} from "./types/sheet";
