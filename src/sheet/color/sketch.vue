<script setup>
import {computed} from "vue";
import {Sketch} from "@ckpack/vue-color";
import safeGet from "@fengqiaogang/safe-get";

const $emit = defineEmits(["update:value", "change"]);
const props = defineProps({
  value: {
    type: String,
    required: false,
  },
  config: {
    type: Array,
    required: false,
    default: () => {
      return [
        '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321',
        '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2',
        '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF',
        'rgba(0,0,0,0)',
      ]
    }
  }
});

const value = computed({
  get: () => {
    return props.value || "";
  },
  set: (data) => {
    // rgba(red, green, blue, alpha)
    const red = safeGet(data, 'rgba.r');
    const green = safeGet(data, 'rgba.g');
    const blue = safeGet(data, 'rgba.b');
    const alpha = safeGet(data, 'rgba.a');
    const value = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

    $emit("change", value);
    $emit("update:value", value);
  }
});

</script>

<template>
  <div class="select-none w-[220px]" translate="no">
    <Sketch v-model="value" :preset-colors="config" :disable-fields="true"></Sketch>
  </div>
</template>
