<script setup lang="ts">
import {ref} from "vue";
import Sketch from "./sketch.vue";

const $emit = defineEmits(["update:value", "select"]);
const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
  },
  value: {
    type: String,
    required: false,
  },
  config: {
    type: Array,
    required: false,
  }
});

const colorRef = ref();
const color = ref(props.value);
const status = ref<boolean>(false);

const onSelectColor = function (value: string) {
  if (value && /(0,\s*0,\s*0,\s*0)/i.test(value)) {
    $emit("update:value", void 0);
  } else {
    $emit("update:value", value);
  }
}

const onHide = function () {
  status.value = false;
  $emit("select", color.value);
}

function isDescendant(container: HTMLElement, target: HTMLElement) {
  if (!container || !target) {
    return false;
  }
  // IE6-IE10 以及所有现代浏览器都支持 contains
  // contains() 返回 true 代表：
  // 1. target === container
  // 2. target 是 container 任意层级子节点
  return container.contains(target);
}

const blankClick = function (e: Event) {
  const status = isDescendant(colorRef.value, e.target as HTMLElement);
  if (status) {
    return;
  }
  removeEvent();
  onHide();
}

const removeEvent = function () {
  window.removeEventListener("click", blankClick);
}

const onClick = function (e: Event) {
  status.value = true;
  removeEvent();
  window.addEventListener("click", blankClick);
}

</script>

<template>
  <div class="select-none relative" ref="colorRef">
    <div @click="onClick">
      <slot></slot>
    </div>
    <div class="absolute left-0 top-full z-10 pt-1" v-if="status">
      <Sketch v-model:value="color" :config="config" @change="onSelectColor"></Sketch>
    </div>
  </div>
</template>