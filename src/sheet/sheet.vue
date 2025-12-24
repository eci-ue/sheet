<script setup lang="ts">
import * as _ from "lodash-es";
import Toolbar from "./toolbar.vue";
import * as styleCell from "./cell";
import {GetCellView} from "./register";
import * as preview from "../util/preview";
import {emitNames, useEvent} from "./event";
import safeGet from "@fengqiaogang/safe-get";
import {useColumnList, useRowList} from "./use";
import {onMounted, watch, ref, computed} from "vue";
import {Column, CellType, Cell} from "../types/sheet";
import {SheetConfig, Icon, addColumnKey} from "./config";
import {Group, ListColumn, ListTable, Image, Text} from "@visactor/vue-vtable";

import type {PropType} from "vue";
import type {Row} from "../types/sheet";
import type {ColumnList, ContextMenu, RowList} from "../types/prop";

const $emit = defineEmits(["update:loading", "clickFile", "upload", "custom", ...emitNames]);
const props = defineProps({
  sheetId: {
    required: false,
    type: [String, Number] as PropType<string | number>,
  },
  // 标题列表
  columnList: {
    required: false,
    type: Function as PropType<ColumnList>
  },
  // 行列表
  rowList: {
    required: false,
    type: Function as PropType<RowList>
  },
  // 菜单列表
  contextMenu: {
    required: false,
    type: Function as PropType<ContextMenu>
  },
  // 表格配置项，为空时使用默认配置规则
  config: {
    required: false,
    type: [Object, Function]
  },
  // 是否禁用
  disabled: {
    required: false,
    type: Boolean as PropType<boolean>,
  },
  toolbar: {
    required: false,
    type: Boolean as PropType<boolean>,
  },
  addColumn: {
    required: false,
    type: Boolean as PropType<boolean>,
  },
});

const fileRef = ref();
const imageRef = ref();
const {sheetRef, getInstance, bindEvent, toolbarClick, getSelectedCells, clearSelected} = useEvent();

// 获取行数据
const {
  state: rows,
  isLoading: loadingRow,
  execute: onLoadRows
} = useRowList(sheetRef, props.disabled, props.rowList, [], false);
// 获取列数据
const {
  state: columns,
  isLoading: loadingColumn,
  execute: onLoadColumns
} = useColumnList(sheetRef, props.disabled, props.columnList, [], false);

// 监听 loading 状态
watch([loadingRow, loadingColumn], () => {
  if (loadingRow.value || loadingColumn.value) {
    $emit("update:loading", true);
  } else {
    $emit("update:loading", false);
  }
});

const onLoad = function (type?: string) {
  if (type) {
    if (onLoadRows && type === "row") {
      onLoadRows();
    } else if (onLoadColumns && type === "column") {
      onLoadColumns();
    }
  } else {
    if (onLoadRows) {
      onLoadRows();
    }
    if (onLoadColumns) {
      onLoadColumns();
    }
  }
}

// 添加列
const onAddColumn = _.debounce(function (e: Event) {
  // 如果是右键触发，则不进行任何处理
  const button = safeGet<number>(e, "button");
  if (button && button === 2) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  const data = new Column();
  data.type = CellType.text;
  $emit("addColumn", {
    column: data,
    direction: 1,
    columnId: void 0,
  });
}, 300, {leading: true, trailing: false});

let onFileSelect: any = () => void 0;

// 上传文件
const onFileUpload = function (column: Column, record: Row) {
  if (props.disabled || column.readOnly) {
    return;
  }
  let cell = safeGet<Cell>(record, column.columnId);
  if (!cell) {
    cell = new Cell();
    cell.rowId = record.rowId;
    cell.columnId = column.columnId;
  }
  onFileSelect = function (e: Event) {
    const dom = e.target as HTMLInputElement;
    const file = (dom.files || [])[0];  // 获取 File 对象
    if (file) {
      const callback = function () {
        dom.value = "";
      }
      $emit("upload", {cell, file, callback});
    }
  }
  // 模拟点击 input, 打开文件选择框
  if (column.type === CellType.image) {
    const dom = imageRef.value;
    dom.click();
  } else {
    const dom = fileRef.value;
    dom.click();
  }
}

// 查看文件
const onFileShow = function (column: Column, record: Row) {
  const cell = safeGet<Cell>(record, column.columnId);
  if (cell && cell.txt) {
    $emit("clickFile", cell);
  } else {
    return onFileUpload(column, record);
  }
}


onMounted(function () {
  onLoad();
  setTimeout(() => bindEvent($emit));
});

defineExpose({
  rows,          // 内容列表
  columns,       // 表头列表
  load: onLoad,  // 整体刷新
  loadRows: () => onLoad("row"),        // 刷新表格内容
  loadColumns: () => onLoad("column"),  // 刷新表头内容
  getInstance,      // 获取表格对象
  getSelectedCells, // 获取当前选中的单元格内容
  clearSelected,    // 清除单元格选中状态
  toolbarClick,
});

const customCell = function (value: any): any {
  const node = GetCellView(value);
  return node ? node : value;
}

// Table Config
const sheetOption = computed<object>(function () {
  if (props.config) {
    if (typeof props.config === "function") {
      return props.config(props.sheetId, props.disabled, props.contextMenu);
    }
    if (typeof props.config === "object") {
      return props.config;
    }
  }
  // 默认配置
  return SheetConfig(props.sheetId, props.disabled, props.contextMenu);
})

const onCustom = function (e: Event) {
  $emit("custom", e);
}

</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-x-5 sheet-header" v-if="toolbar">
      <Toolbar @click="toolbarClick" :disabled="disabled"></Toolbar>
      <div class="flex-1">
        <slot name="toolbar"></slot>
      </div>
    </div>
    <div class="flex-auto">
      <div style="display: none">
        <input type="file" ref="fileRef" @change="onFileSelect"/>
        <input type="file" accept="image/*" ref="imageRef" @change="onFileSelect"/>
      </div>
      <ListTable ref="sheetRef"
                 :records="rows"
                 :options="sheetOption"
                 rowResize-mode="all"
                 rowResize-type="row">
        <template v-for="column in columns" :key="column.columnId">
          <!--附件-->
          <ListColumn v-if="column.type === CellType.file || column.type === CellType.image"
                      :field="column.columnId"
                      :title="column.label"
                      :width="Math.max(column.width, 150)"
                      :merge-cell="false"
                      :editor="column.editor"
                      :options="column.options"
                      :type="column.type"
                      :readOnly="column.readOnly">
            <template #customLayout="{ width, height, record }">
              <Group
                  :width="width"
                  :height="height"
                  display="flex"
                  align-items="center">
                <template v-if="record[column.columnId] && preview.isImage(record[column.columnId].txt)">
                  <Image cursor="pointer" :image="record[column.columnId].txt" :width="20" :height="20"
                         :boundsPadding="[0, 15, 0, 15]" @click="onFileShow(column, record)"/>
                </template>
                <template v-else-if="record[column.columnId] && preview.isAudio(record[column.columnId].txt)">
                  <Image cursor="pointer" :image="Icon.auto" :width="20" :height="20"
                         :boundsPadding="[0, 15, 0, 15]" @click="onFileShow(column, record)"/>
                </template>
                <template v-else-if="record[column.columnId] && preview.isVideo(record[column.columnId].txt)">
                  <Image cursor="pointer" :image="Icon.video" :width="20" :height="20"
                         :boundsPadding="[0, 15, 0, 15]" @click="onFileShow(column, record)"/>
                </template>
                <template v-else-if="record[column.columnId] && preview.isZip(record[column.columnId].txt)">
                  <Image cursor="pointer" :image="Icon.zip" :width="20" :height="20"
                         :boundsPadding="[0, 15, 0, 15]" @click="onFileShow(column, record)"/>
                </template>
                <template v-else-if="record[column.columnId] && record[column.columnId].txt">
                  <Image cursor="pointer" :image="Icon.auto" :width="20" :height="20"
                         :boundsPadding="[0, 15, 0, 15]" @click="onFileShow(column, record)"/>
                </template>
                <Image :image="Icon.upload" :width="20" :height="20" :boundsPadding="[0, 15, 0, 15]" cursor="pointer"
                       @click="onFileUpload(column, record)"/>
              </Group>
            </template>
          </ListColumn>
          <ListColumn v-else-if="column.custom"
                      :field="column.columnId"
                      :title="column.label"
                      :width="Math.max(column.width, 150)"
                      :merge-cell="false"
                      :editor="column.editor"
                      :options="column.options"
                      :type="column.type"
                      :fieldFormat="styleCell.format(column.columnId)"
                      :style="styleCell.Style"
                      :readOnly="column.readOnly">
            <template #customLayout="{ width, height, record }">
              <Group :width="width" :height="height" display="flex" align-items="center" :vue="{}">
                <component :is="customCell(column.custom)"
                           :width="width"
                           :height="height"
                           :row="record"
                           :column="column"
                           :sheet-id="sheetId"
                           @custom="onCustom"/>
              </Group>
            </template>
          </ListColumn>
          <!--默认展示方式-->
          <ListColumn v-else
                      :field="column.columnId"
                      :title="column.label"
                      :width="Math.max(column.width, 150)"
                      :merge-cell="false"
                      :editor="column.editor"
                      :options="column.options"
                      :type="column.type"
                      :fieldFormat="styleCell.format(column.columnId)"
                      :style="styleCell.Style"
                      :readOnly="column.readOnly">
          </ListColumn>
        </template>
        <!--新增列-->
        <ListColumn v-if="addColumn ? !disabled : false" :field="addColumnKey" :width="60" :drag-header="false"
                    :drag-body="false"
                    :sortable="false"
                    :disable-select="true" :disable-column-resize="true" :disable-header-select="true"
                    :merge-cell="false">
          <template #headerCustomLayout="{ width, height }">
            <Group :width="width" :height="height" display="flex" align-items="center" justify-content="center"
                   cursor="pointer" :padding="0" @click="onAddColumn">
              <Image :image="Icon.plus" :width="20" :boundsPadding="[0, 15, 0, 15]" cursor="pointer"/>
            </Group>
          </template>
          <template #customLayout="{ width, height }">
            <Group :width="width" :height="height">
              <Text/>
            </Group>
          </template>
        </ListColumn>
      </ListTable>
    </div>
  </div>
</template>


