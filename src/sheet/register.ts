import {EditorMap} from "./widgets";
import * as VTable from '@visactor/vtable';
import safeGet from "@fengqiaogang/safe-get";
import {EditContext, IEditor} from '@visactor/vtable-editors';

import type {Column, EditCellData, Cell} from "../types/sheet";

const CellView = new Map<string, IEditor>();
const RegisterStatus = new Set<string>();

export enum CellEventName {
  Edit = "CellEdit",
  Style = "CellStyle",
}

export const HasCellView = function (name: string): boolean {
  return CellView.has(name);
}

export const GetCellView = function (name: string): IEditor | undefined {
  return CellView.get(name);
}

export const RemoveCellView = function (name: string): boolean {
  RegisterStatus.delete(name);
  return CellView.delete(name);
}

export const SetCellView = function (name: string, editor: IEditor): boolean {
  if (HasCellView(name)) {
    RemoveCellView(name);
  }
  CellView.set(name, editor);
  return true;
}

export const makeCellEditorName = function (type: string | number): string {
  return `cell-edit-${type}`;
}

let __init: boolean = false
const init = function () {
  if (__init) {
    return;
  }
  __init = true;
  for (const type of Object.keys(EditorMap)) {
    const editor = safeGet<IEditor>(EditorMap, type)!;
    const name = makeCellEditorName(type);
    SetCellView(name, editor);
    RegisterCell({type} as any);
  }
}

const MakeCellEditor = function (View: IEditor) {
  // @ts-ignore
  class CellView extends View implements IEditor {
    public rowIndex: number = 0;
    public columnIndex: number = 0;
    public cellValue?: Cell;
    public sheetId?: string | number;
    public contextValue!: EditContext;

    onStart(context: EditContext<any, any>) {
      this.contextValue = context;
      const cell = (context.value || {}) as Cell;
      return super.onStart({
        ...context,
        value: cell ? cell.txt : void 0
      });
    }

    onEnd() {
      if (this.contextValue?.table?.fireListeners) {
        // @ts-ignore
        const txt = this.getValue();
        const cell = (this.contextValue.value || {}) as Cell;
        const sheetId = safeGet<string | number>(this.contextValue, "table.options.sheetId");
        const data: EditCellData = {
          sheetId,
          row: this.contextValue.row,
          column: this.contextValue.col,
          value: {...cell, txt},
        }
        this.contextValue.table.fireListeners(CellEventName.Edit, [data]);
      }
      return super.onEnd();
    }
  }

  return CellView;
}

export const RegisterCell = function (data: Column, disabled?: boolean): string | undefined {
  init();
  if (disabled || data.readOnly) {
    return void 0;
  }
  const name = makeCellEditorName(data.type);
  // 检查是否注入
  const View = GetCellView(name);
  if (View && RegisterStatus.has(name)) {
    return name;
  }
  if (View) {
    const CellView = MakeCellEditor(View)
    const cell = new CellView();
    // @ts-ignore
    VTable.register.editor(name, cell);
    RegisterStatus.add(name);
    return name;
  }
}