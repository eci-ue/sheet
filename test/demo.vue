<script setup lang="ts">
import { ref } from "vue";
import { Sheet } from "../src/index";
import * as api from "./api";

const loading = ref<boolean>();

const onChange = function(){

}

</script>

<template>
  <div class="sheet-ui" :class="{'loading': loading}">
    <Sheet
      v-model:loading="loading"
      :sheet-id="api.id"
      :column-list="api.getColumnList"
      :row-list="api.getRowList" @change="onChange"/>
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
  background-color: rgba(0,0,0, 0.2);
  transition: all 0.3s;
}

.loading:after {
  display: flex;
}
</style>
