<script setup lang="ts">

const $emit = defineEmits(["click"]);

const onClick = function (type: string) {
  $emit("click", type);
}

</script>

<template>
  <div class="flex items-center gap-x-2 text-xl font-normal p-2">
    <span class="flex cursor-pointer" @click="onClick('clean')">
      <img class="inline-block w-5" src="./icon/clean.svg">
    </span>
    <span class="inline-block px-2 cursor-pointer" @click="onClick('bold')">B</span>
    <span class="inline-block px-2 cursor-pointer italic" @click="onClick('italic')">I</span>
    <span class="inline-block px-2 cursor-pointer line-through" @click="onClick('through')">S</span>
    <span class="inline-block px-2 cursor-pointer underline" @click="onClick('underline')">U</span>
    <span class="inline-block px-2 cursor-pointer underline decoration-red-700"  @click="onClick('font')">A</span>
    <span class="inline-block px-2 cursor-pointer underline decoration-orange-300"  @click="onClick('fill')">F</span>
  </div>
</template>
