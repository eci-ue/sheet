import {EditorMap} from "./widgets";
import * as VTable from '@visactor/vtable';
import safeGet from "@fengqiaogang/safe-get";
import {EditContext, IEditor} from '@visactor/vtable-editors';

import type {Component, VNode} from "vue";
import type {Column, EditCellData, Cell} from "../types/sheet";

const RegisterStatus = new Set<string>();
const CellView = new Map<string, IEditor | Component | VNode>();

export enum CellEventName {
  Edit = "CellEdit",
  Style = "CellStyle",
}

export const HasCellView = function (name: string): boolean {
  return CellView.has(name);
}

export const GetCellView = function(name: string): IEditor | Component | VNode | undefined {
  return CellView.get(name);
}

export const RemoveCellView = function (name: string): boolean {
  RegisterStatus.delete(name);
  return CellView.delete(name);
}

export const SetCellView = function (name: string, editor: IEditor | Component | VNode): boolean {
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
export const init = function () {
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
    public contextValue!: EditContext;

    public _getData(context?: EditContext<any, any>) {
      const ctx = context || this.contextValue;
      const cell = (ctx.value || {}) as Cell;
      const sheetId = safeGet<string | number>(ctx, "table.options.sheetId");
      return {
        sheetId,
        cell,
        row: ctx.row,
        column: ctx.col,
      }
    }

    onStart(context: EditContext<any, any>) {
      this.contextValue = context;
      const cell = (context.value || {}) as Cell;
      let value: any = cell ? cell.txt : void 0;
      return super.onStart({
        ...context,
        value
      });
    }

    onEnd() {
      if (this.contextValue?.table?.fireListeners) {
        // @ts-ignore
        const txt = this.getValue();
        const res = this._getData(this.contextValue);
        const data: EditCellData = {
          sheetId: res.sheetId,
          row: res.row,
          column: res.column,
          value: {...res.cell, txt},
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
  const View = GetCellView(name) as IEditor;
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