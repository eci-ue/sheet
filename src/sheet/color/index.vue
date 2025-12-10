<script setup lang="ts">
import Sketch from "./sketch.vue";
import {ref, onUnmounted} from "vue";
// @ts-ignore
import { isDescendant } from "../../util/dom";

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
const color = ref<string>();
const status = ref<boolean>(false);

const onSelectColor = function (value: string) {
  let res: string | undefined = value;
  if (value && /(0,\s*0,\s*0,\s*0)/i.test(value)) {
    res = void 0;
    $emit("update:value", void 0);
  } else {
    $emit("update:value", value);
  }
  $emit("select", res);
}

const onHide = function () {
  status.value = false;
  //
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

const onClick = function () {
  color.value = props.value;
  status.value = true;
  removeEvent();
  window.addEventListener("click", blankClick);
}
onUnmounted(onHide);
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