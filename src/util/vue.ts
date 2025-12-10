import { createApp } from 'vue';
import type { Component } from "vue";

export const CreateApp = function(component: Component, dom?: string | HTMLElement) {
  let app: any;
  if (dom) {
    app = createApp(component);
    app.mount(dom);
  }
  return app;
}