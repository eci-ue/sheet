import type {Column, Row} from "./sheet";

export type ColumnList = () => Promise<Column[]>;

export type RowList = () => Promise<Row[]>;

export type ContextMenu = (sheetId: number | string | undefined, disabled: boolean, field: string, row: number, col: number) => object[] | undefined;