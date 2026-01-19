<script setup lang="ts">
import Spin from "./spin.vue";
import {Table, CellType, Column} from "../src/index";

const columns: Column[] = [
  {type: CellType.text, label: "A", readOnly: false, columnId: "key1", fixed: true, width: 200},
  {type: CellType.file, label: "B", readOnly: false, columnId: "key2", width: 150},
  {type: CellType.text, label: "C", readOnly: true, columnId: "key3"},
  {type: CellType.text, label: "D", readOnly: true, columnId: "key4"},
  {type: CellType.text, label: "E", readOnly: true, columnId: "key5"},
  {type: CellType.text, label: "F", readOnly: true, columnId: "key6"},
  {type: CellType.text, label: "G", readOnly: true, columnId: "key7"},
  {type: CellType.text, label: "H", readOnly: true, columnId: "key8"},
  {type: CellType.text, label: "I", readOnly: true, columnId: "key9", fixed: "right", width: 200},
]

const list = [
  {
    key1: "A1",
    key2: `[
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx",
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx",
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx"
    ]`
  },
  {
    key1: "A1",
    key2: `[
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx",
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx",
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx"
    ]`
  },
  {
    key1: "A1",
    key2: `[
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx",
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx",
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx"
    ]`
  },
  {
    key1: "A1",
    key2: `[
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx",
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx",
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx"
    ]`
  },
  {
    key1: "A1",
    key2: `[
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx",
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx",
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx"
    ]`
  },
  {
    key1: "A1",
    key2: `[
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx",
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx",
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx"
    ]`
  },
  {
    key1: "A1",
    key2: `[
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx",
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx",
      "https://lint.eci.games/out/images/20251226/90TkWIKbJUPTwB6WDRzJGqg88UPvcQ/QIDSSR_eCOA%20Tablet.xlsx"
    ]`
  },
];
</script>

<template>
  <Spin :loading="false">
    <Table class="h-full"
           :column-list="columns"
           :row-list="list"
           :row-number="false"
           :add-column="false"/>
  </Spin>
</template>
