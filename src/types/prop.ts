import type { Column, Row } from "./sheet";

export type ColumnList = () => Promise<Column[]>;

export type RowList = () => Promise<Row[]>;

export type ContextMenu = (field: string, row: number, col: number) => object[] | undefined;