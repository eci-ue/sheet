<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    required: false,
  }
})
</script>

<template>
  <div class="sheet-ui" :class="{'loading': loading}">
    <slot></slot>
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
  background-color: rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.loading:after {
  display: flex;
}
</style>