<script setup lang="ts">
import * as _ from "lodash-es";
import * as api from "./api";
import {ref} from "vue";
import Button from "./button.vue";
import safeGet from "@fengqiaogang/safe-get";
import {Sheet, fillGenerate, fillCellCompute, RegisterInit, SetCellView} from "../src";

import type {Column, Row, Cell, FillCellOption} from "../src";

const sheetRef = ref();
const loading = ref<boolean>();

RegisterInit();

SetCellView("sheet-button", Button);

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

// 修改列宽
const onWidthColumn = async function (data: object) {
  const width = safeGet<number>(data, "width") || 0;
  const index = safeGet<number>(data, "index")!;
  const columns: Column[] = sheetRef.value?.columns || [];
  const column = columns[index - 1];
  column.width = width < 120 ? 120 : width;
  const status = await api.updateColumn(column);
  if (status && sheetRef.value && sheetRef.value.loadRows) {
    await sheetRef.value.loadColumns();
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

const onRemoveRow = async function (rowIds: string[]) {
  const status = await api.removeRow(rowIds);
  if (status && sheetRef.value && sheetRef.value.loadRows) {
    await sheetRef.value.loadRows();
  }
}

// 移动事件
const onMove = async function (data: object) {
  const startX = safeGet<number>(data, "startX") || 0;
  const endX = safeGet<number>(data, "endX") || 0;
  const startY = safeGet<number>(data, "startY") || 0;
  const endY = safeGet<number>(data, "endY") || 0;
  if (startY === 0 && endY === 0) {
    const start = startX - 1;
    const end = endX - 1;
    if (start >= 0 && end >= 0) {
      const columns: Column[] = sheetRef.value?.columns || [];
      const source = columns[start].columnId;
      const target = columns[end].columnId;
      if (source && target) {
        await api.moveColumn(source, target)
      }
    }
    return;
  }
  if (startX === 0 && endX === 0) {
    const start = startY - 1;
    const end = endY - 1;
    if (start >= 0 && end >= 0) {
      await api.moveRow(String(start), String(end));
    }
    return;
  }
}

// 单元格填充
const onFillCell = function (value: FillCellOption) {
  if (sheetRef.value) {
    const res = fillCellCompute(value, sheetRef.value.columns, sheetRef.value.rows);
    if (res && res.length > 0) {
      return onUpdateCell(res);
    }
  }
}

// 查看文件
const onShowFile = function (cell: Cell) {
  console.log(cell);
}

// @上传文件
const onUpload = function (cell: Cell) {
  console.log(cell);
}

</script>

<template>
  <div class="sheet-ui" :class="{'loading': loading}">
    <Sheet ref="sheetRef"
           v-model:loading="loading"
           :disabled="false"
           :toolbar="true"
           :sheet-id="api.id"
           :add-column="true"
           :column-list="api.getColumnList"
           :row-list="api.getRowList"
           @move="onMove"
           @change="onChange"
           @updateCell="onUpdateCell"
           @addColumn="onAddColumn"
           @removeColumn="onRemoveColumn"
           @editColumn="onEditColumn"
           @widthColumn="onWidthColumn"
           @addRow="onAddRow"
           @removeRow="onRemoveRow"
           @fillCell="onFillCell"
           @clickFile="onShowFile"
           @upload="onUpload">
    </Sheet>
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
