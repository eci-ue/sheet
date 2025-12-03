<script setup lang="ts">
import Color from "./color/index.vue";
import {ToolbarEvent, Icon} from "./config";

import type {PropType} from "vue";

const $emit = defineEmits(["click"]);

defineProps({
  // 是否禁用
  disabled: {
    required: false,
    type: Boolean as PropType<boolean>,
  },
});

const onClick = function (type: string, value?: string) {
  if (type === ToolbarEvent.Font || type === ToolbarEvent.Fill) {
    $emit("click", type, value);
  } else {
    $emit("click", type, true);
  }
}

</script>

<template>
  <div class="flex items-center gap-x-2 text-xl font-normal p-2">
    <span class="flex" :class="{'pointer-events-none': disabled, 'cursor-pointer': !disabled}" @click="onClick(ToolbarEvent.Clean)">
      <img class="inline-block w-5" :src="Icon.clean">
    </span>
    <span class="inline-block px-2" :class="{'pointer-events-none': disabled, 'cursor-pointer': !disabled}" @click="onClick(ToolbarEvent.Bold)">B</span>
    <span class="inline-block px-2 italic" :class="{'pointer-events-none': disabled, 'cursor-pointer': !disabled}" @click="onClick(ToolbarEvent.Italic)">I</span>
    <span class="inline-block px-2 line-through" :class="{'pointer-events-none': disabled, 'cursor-pointer': !disabled}" @click="onClick(ToolbarEvent.Through)">S</span>
    <span class="inline-block px-2 underline" :class="{'pointer-events-none': disabled, 'cursor-pointer': !disabled}" @click="onClick(ToolbarEvent.Underline)">U</span>
    <Color class="inline-block" :class="{'pointer-events-none': disabled}" @select="onClick(ToolbarEvent.Font, $event)">
      <span class="inline-block px-2 underline decoration-red-700" :class="{'cursor-pointer': !disabled}">A</span>
    </Color>
    <Color class="inline-block" :class="{'pointer-events-none': disabled}" @select="onClick(ToolbarEvent.Fill, $event)">
      <span class="flex" :class="{'cursor-pointer': !disabled}">
        <img class="inline-block w-5" :src="Icon.fill">
      </span>
    </Color>
  </div>
</template>
