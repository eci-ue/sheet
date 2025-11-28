/**
 * @file Sheet
 * @author svon.me@gmail.com
 */

export {useEvent} from "./sheet/event";
export {CellEventName} from "./sheet/register";
export {merge as CellMerge} from "./sheet/merge";
export type {Row, RowBasis, RowCells} from "./types/sheet";
export {StyleValue, SheetConfig, MenuEvent} from "./sheet/config";
export type {ColumnList, RowList, ContextMenu} from "./types/prop";
export {CellType, OptionKV, Column, Cell, EditCellData} from "./types/sheet";
export {fillGenerateValue as fillGenerate} from "./sheet/fill";

export {default as Sheet} from "./sheet/sheet.vue";
