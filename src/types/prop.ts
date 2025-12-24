import type {Column, Row} from "./sheet";

export type ColumnList = () => Promise<Column[]> | Column[];

export type RowList = () => Promise<Row[]> | Row[];

export type ContextMenu = (sheetId: number | string | undefined, disabled: boolean, field: string, row: number, col: number, table: object, addColumn?: boolean) => object[] | undefined;