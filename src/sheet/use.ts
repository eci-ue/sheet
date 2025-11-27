import { RegisterCell } from "./register";
import {useAsyncState} from "@vueuse/core";

import type { Ref } from "vue";
import type { Column, Row } from "../types/sheet";
import type { ColumnList, RowList } from "../types/prop";

// 注册单元格视图功能
export const RegisterCellView = function(sheetRef: Ref<any>, disabled?: boolean, list: Column[] = []): Column[] {
  if (!sheetRef.value || disabled) {
    return list;
  }
  const array : Column[] = [];
  for (const column of list) {
    const name = RegisterCell(column, disabled);
    array.push({ ...column, editor: name });
  }
  return array;
}

// 获取表格列数据
export const useColumnList = function(sheetRef: Ref<any>, disabled?: boolean, api?: ColumnList, initialState: Column[] = [], execute?: boolean) {
  const option = {
    delay: 100,
    immediate: !!execute,
    resetOnExecute: false,
  };
  const app = async function() {
    if (!api) {
      return [];
    }
    const res = await api();
    if (res) {
      return RegisterCellView(sheetRef, disabled, res);
    }
    return [];
  }
  return useAsyncState(app, initialState, option);
}

// 获取表格行数据
export const useRowList = function(sheetRef: Ref<any>, disabled?: boolean, api?: RowList, initialState: Row[] = [], execute?: boolean) {
  const option = {
    delay: 100,
    immediate: !!execute,
    resetOnExecute: false,
  };
  const app = async function() {
    if (!api) {
      return [];
    }
    const res = await api();
    return res ? res : [];
  }
  return useAsyncState(app, initialState, option);
}