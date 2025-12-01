/**
 * @file Sheet
 * @author svon.me@gmail.com
 */

export {useEvent} from "./sheet/event";
export {CellEventName} from "./sheet/register";
export {merge as CellMerge} from "./sheet/merge";
export {StyleValue, SheetConfig, MenuEvent} from "./sheet/config";
export type {ColumnList, RowList, ContextMenu} from "./types/prop";
export {CellType, OptionKV, Column, Cell, EditCellData} from "./types/sheet";
export {fillGenerateValue as fillGenerate, fillCellCompute} from "./sheet/fill";

export {default as Sheet} from "./sheet/sheet.vue";

export type {Row, RowBasis, RowCells, FillCellOption} from "./types/sheet";
