<script setup lang="ts">
import * as _ from "lodash-es";
import Toolbar from "./toolbar.vue";
import {onMounted, watch} from "vue";
import AddColumnIcon from "./icon/plus.svg";
import {useColumnList, useRowList} from "./use";
import {Column, CellType} from "../types/sheet";
import {SheetConfig, StyleValue} from "./config";
import {emitNames, ToolbarEvent, useEvent} from "./event";
import {Group, ListColumn, ListTable, Text, Image} from "@visactor/vue-vtable";

import type {PropType} from "vue";
import type {ColumnList, ContextMenu, RowList} from "../types/prop";

const $emit = defineEmits(["update:loading", ...emitNames]);
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
    type: Object as PropType<object>
  },
  // 是否禁用
  disabled: {
    required: false,
    type: Boolean as PropType<boolean>,
  },
  toolbar: {
    required: false,
    type: Boolean as PropType<boolean>,
  }
});

const {sheetRef, getInstance, bindEvent, toolbarClick} = useEvent();

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

const onAddColumn = function () {
  const data = new Column();
  data.type = CellType.text;
  data.sheetId = props.sheetId;

  $emit("addColumn", {
    column: data,
    direction: 1,
    columnId: void 0,
  })
}


onMounted(function () {
  onLoad();
  setTimeout(() => bindEvent($emit));
});


defineExpose({
  load: onLoad,
  loadRows: () => onLoad("row"),
  loadColumns: () => onLoad("column"),
  getInstance,
});

</script>

<template>
  <div class="flex flex-col h-full">
    <Toolbar v-if="toolbar" @click="toolbarClick"></Toolbar>
    <div class="flex-auto">
      <ListTable ref="sheetRef"
                 :records="rows"
                 :options="config || SheetConfig(sheetId, disabled, contextMenu)"
                 rowResize-mode="all"
                 rowResize-type="row">
        <ListColumn v-for="column in columns"
                    :key="column.columnId"
                    :field="column.columnId"
                    :title="column.label"
                    :width="Math.max(column.width, 150)"
                    :merge-cell="false"
                    :editor="column.editor"
                    :options="column.options"
                    :type="column.type">
          <template #customLayout="{ width, height, record }">
            <Group :width="width" :height="height" display="flex" align-items="center" justify-content="center">
              <Group :width="width - 2" :height="height - 2" display="flex" align-items="center"
                     :fill="StyleValue(column.columnId, record, ToolbarEvent.Fill)">
                <template v-if="record[column.columnId] && _.isString(record[column.columnId])">
                  <Text :text="record[column.columnId]"
                        :fontSize="14"
                        fontFamily="sans-serif"
                        :boundsPadding="[0, 13, 0, 13]"/>
                </template>
                <template v-else-if="record[column.columnId]">
                  <Text :text="record[column.columnId].txt"
                        :fontSize="14"
                        :fontVariant="StyleValue(column.columnId, record, ToolbarEvent.Bold)"
                        :underline="StyleValue(column.columnId, record, ToolbarEvent.Underline)"
                        :lineThrough="StyleValue(column.columnId, record, ToolbarEvent.Through)"
                        :fontStyle="StyleValue(column.columnId, record, ToolbarEvent.Italic)"
                        :fill="StyleValue(column.columnId, record, ToolbarEvent.Font)"
                        fontFamily="sans-serif"
                        :boundsPadding="[0, 15, 0, 15]"/>
                </template>
              </Group>
            </Group>
          </template>
        </ListColumn>
        <ListColumn field="add_column" :width="60" :drag-header="false" :drag-body="false" :sortable="false"
                    :disable-select="true" :disable-column-resize="true" :disable-header-select="true"
                    :merge-cell="false">
          <template #headerCustomLayout="{ width, height }">
            <Group :width="width" :height="height" display="flex" align-items="center" justify-content="center" cursor="pointer" :padding="0" @dblclick="onAddColumn()">
              <Image :image="AddColumnIcon" :width="20" :boundsPadding="[0, 15, 0, 15]" cursor="pointer"/>
            </Group>
          </template>
        </ListColumn>
      </ListTable>
    </div>
  </div>
</template>


