<script setup lang="ts">
import { SheetConfig } from "./config";
import { ref, watch, onMounted } from "vue";
import { CellEditEventName } from "./register";
import {ListTable, ListColumn, Group} from "@visactor/vue-vtable";

import { useColumnList, useRowList } from "./use";

import type { PropType } from "vue";
import type { EditCellData } from "../types/sheet";
import type { ColumnList, RowList, ContextMenu } from "../types/prop";

const $emit = defineEmits(["update:loading", "change"]);
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
  }
});

const sheetRef = ref();

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

const onLoad = function(type?: string) {
  if(type) {
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

onMounted(function() {
  onLoad();
  if (!sheetRef.value.vTableInstance) {
    return;
  }
  const table = sheetRef.value.vTableInstance;
  table.on(CellEditEventName, function(data: EditCellData) {
    $emit("change", data);
  })
});


defineExpose({
  load: onLoad,
  loadRows: () => onLoad("row"),
  loadColumns: () => onLoad("column"),
});

</script>

<template>
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
    </ListColumn>
  </ListTable>
</template>

