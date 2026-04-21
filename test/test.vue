<script setup lang="ts">
import {CellType, Column, RegisterInit, Sheet, Row} from "../src/index";

RegisterInit();

const columns: Column[] = [
  {type: CellType.text, label: "A", columnId: "key1", width: 200},
  {type: CellType.text, label: "B", columnId: "key2", width: 150},
]

const list: Row[] = [
  {
    rowId: "001",
    key1: "A1",
    key2: "B1"
  }
];

</script>

<template>
  <div class="h-screen">
    <Sheet
        :column-list="columns"
        :row-list="list">
    </Sheet>
  </div>
</template>

