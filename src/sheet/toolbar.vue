<script setup lang="ts">
import {ToolbarEvent} from "./event";
import Color from "./color/index.vue";
// @ts-ignore
import CleanIcon from "./icon/clean.svg";

const $emit = defineEmits(["click"]);

const onClick = function (type: string, value?: string) {
  if (type === ToolbarEvent.Font || type === ToolbarEvent.Fill) {
    if (value) {
      $emit("click", type, value);
    }
  } else {
    $emit("click", type, true);
  }
}

</script>

<template>
  <div class="flex items-center gap-x-2 text-xl font-normal p-2">
    <span class="flex cursor-pointer" @click="onClick(ToolbarEvent.Clean)">
      <img class="inline-block w-5" :src="CleanIcon">
    </span>
    <span class="inline-block px-2 cursor-pointer" @click="onClick(ToolbarEvent.Bold)">B</span>
    <span class="inline-block px-2 cursor-pointer italic" @click="onClick(ToolbarEvent.Italic)">I</span>
    <span class="inline-block px-2 cursor-pointer line-through" @click="onClick(ToolbarEvent.Through)">S</span>
    <span class="inline-block px-2 cursor-pointer underline" @click="onClick(ToolbarEvent.Underline)">U</span>
    <Color class="inline-block" @select="onClick(ToolbarEvent.Font, $event)">
      <span class="inline-block px-2 cursor-pointer underline decoration-red-700">A</span>
    </Color>
    <Color class="inline-block" @select="onClick(ToolbarEvent.Fill, $event)">
      <span class="inline-block px-2 cursor-pointer underline decoration-orange-300">F</span>
    </Color>
  </div>
</template>
