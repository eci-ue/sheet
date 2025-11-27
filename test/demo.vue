<script setup lang="ts">
import {ref, onMounted} from "vue";
import {Sheet} from "../src/index";
import * as api from "./api";
import safeGet from "@fengqiaogang/safe-get";

const sheetRef = ref();
const loading = ref<boolean>();

const onChange = async function (value: object[]) {
  const status = await api.updateCells(value);
  if (status && sheetRef.value && sheetRef.value.loadRows) {
    await sheetRef.value.loadRows();
  }
}

const onAddColumn = async function (data: object) {
  const column = safeGet<object>(data, "column");
  const columnId = safeGet<string>(data, "columnId");
  const direction = safeGet<number>(data, "direction");
  const status = await api.addColumn(column, columnId, direction);
  if (status && sheetRef.value && sheetRef.value.loadRows) {
    await sheetRef.value.loadColumns();
  }
}

onMounted(function () {
  console.log(sheetRef.value);
});
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
           @addColumn="onAddColumn"/>
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
