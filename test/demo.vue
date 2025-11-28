<script setup lang="ts">
import * as _ from "lodash-es";
import * as api from "./api";
import {ref, onMounted} from "vue";
import {Sheet, fillGenerate} from "../src";
import safeGet from "@fengqiaogang/safe-get";

import type {Column, Row, Cell} from "../src";

const sheetRef = ref();
const loading = ref<boolean>();

// 修改单元格内容
const onChange = async function (value: object[]) {
  const status = await api.updateCells(value);
  if (status && sheetRef.value && sheetRef.value.loadRows) {
    await sheetRef.value.loadRows();
  }
}

// 单元格内容编辑
const onUpdateCell = function (cells: Cell[]) {
  const rows: Row[] = sheetRef.value?.rows || [];
  const columns: Column[] = sheetRef.value?.columns || [];
  const list: Cell[] = [];
  for (const item of cells) {
    if (item.columnId) {
      list.push(item);
    } else {
      // 数据兼容处理
      const row = item.row ? rows[item.row - 1] : void 0;
      const column = item.column ? columns[item.column - 1] : void 0;
      const columnId = column?.columnId;
      const rowId = row?.rowId;
      if (columnId && rowId) {
        list.push({
          ...item,
          rowId,
          columnId,
          x1: void 0,
          x2: void 0,
          y1: void 0,
          y2: void 0,
        });
      }
    }
  }
  return onChange(list);
}

// 添加列
const onAddColumn = async function (data: object) {
  const column = safeGet<Column>(data, "column");
  const columnId = safeGet<string>(data, "columnId");
  const direction = safeGet<number>(data, "direction");
  if (column) {
    const list: Column[] = sheetRef.value?.columns || [];
    column.label = fillGenerate("A", list.length);
    const status = await api.addColumn(column, columnId, direction);
    if (status && sheetRef.value && sheetRef.value.loadRows) {
      await sheetRef.value.loadColumns();
    }
  }
}

// 删除列
const onRemoveColumn = async function (data: object) {
  const columnId = safeGet<string>(data, "columnId");
  if (columnId) {
    const status = await api.removeColumn(columnId);
    if (status && sheetRef.value && sheetRef.value.loadRows) {
      await sheetRef.value.loadColumns();
    }
  }
}

// 编辑列
const onEditColumn = async function (data: object) {
  const columnId = safeGet<string>(data, "columnId");
  if (columnId) {
    let i = 0;
    let data: Column | undefined;
    const columns: Column[] = sheetRef.value?.columns || [];
    for (let size = columns.length; i < size; i++) {
      const column = columns[i];
      if (column.columnId === columnId) {
        data = column;
        break;
      }
    }
    if (data) {
      data.label = fillGenerate("A", i);
      const status = await api.updateColumn(data);
      if (status && sheetRef.value && sheetRef.value.loadRows) {
        await sheetRef.value.loadColumns();
      }
    }
  }
}

const onAddRow = async function (data: object) {
  const rows: Row[] = sheetRef.value?.rows || [];
  const index = safeGet<number>(data, "row");
  const count = safeGet<number>(data, "count") || 1;
  let status: boolean;
  if (_.isNil(index)) {
    status = await api.addRow(count);
  } else {
    const row = rows[index - 1];
    const rowId = row?.rowId;
    status = await api.addRow(count, count > 0 ? 1 : -1, rowId);
  }
  if (status && sheetRef.value && sheetRef.value.loadRows) {
    await sheetRef.value.loadRows();
  }
}

const onRemoveRow = async function(rowIds: string[]) {
  const status = await api.removeRow(rowIds);
  if (status && sheetRef.value && sheetRef.value.loadRows) {
    await sheetRef.value.loadRows();
  }
}

</script>

<template>
  <div class="sheet-ui" :class="{'loading': loading}">
    <Sheet ref="sheetRef"
           v-model:loading="loading"
           :toolbar="true"
           :sheet-id="api.id"
           :column-list="api.getColumnList"
           :row-list="api.getRowList"
           @change="onChange"
           @updateCell="onUpdateCell"
           @addColumn="onAddColumn"
           @removeColumn="onRemoveColumn"
           @editColumn="onEditColumn"
           @addRow="onAddRow"
           @removeRow="onRemoveRow"/>
  </div>
</template>

<style scoped>
.sheet-ui {
  height: 100vh;
  position: relative;
}

.sheet-ui:after {
  display: none;
  content: "Loading ...";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  color: white;
  font-size: 20px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.loading:after {
  display: flex;
}
</style>
