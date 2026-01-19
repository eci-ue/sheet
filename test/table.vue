<script setup lang="ts">
import Spin from "./spin.vue";
import {Table, CellType, Column} from "../src/index";
import URL from "../src/util/url";

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
      "https://lint.eci.games/out/images/20260109/56f2a475e8104ae9a7db67e01ec547a9.png",
      "https://lint.eci.games/out/images/20251106/0l2W73YV9QY9DlPcloMZ97QPi2yvvN/ce426b0b21e35ff5b4c937da59fd90a1.png?filename=image_1.png",
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

const CROP = function (src: string, width?: number, height?: number, fit = "fill", color: string = "") {
  let value = src;
  if (src) {
    const query = [];
    if (width) {
      query.push(`w_${width}`);
    }
    if (height) {
      query.push(`h_${height}`);
    }
    if (fit) {
      query.push(`m_${fit}`);
      if (fit === "pad") {
        query.push(`color_${color}`);
      }
    }
    if (query.length > 0) {
      if (src.includes("?")) {
        value = `${src}&x-oss-process=image/resize,${query.join(",")}`;
      } else {
        value = `${src}?x-oss-process=image/resize,${query.join(",")}`;
      }
    }
  }
  return value;
}

const onCrop = function({src, size}: {src: string, size: number}) {
  return CROP(src, size, size, "pad");
}

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
