/**
 * @file Sheet
 * @author svon.me@gmail.com
 */

export {useEvent} from "./sheet/event";
export {CellEventName} from "./sheet/register";
export {merge as CellMerge} from "./sheet/merge";
export {StyleValue, SheetConfig} from "./sheet/config";
export { CellType, OptionKV, Column, Cell, EditCellData } from "./types/sheet";
export type { Row, RowBasis, RowCells } from "./types/sheet";
export type { ColumnList, RowList, ContextMenu } from "./types/prop";

export {default as Sheet} from "./sheet/sheet.vue";
