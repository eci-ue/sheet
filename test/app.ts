/**
 * @file test
 * @author svon.me@gmail.com
 */

import "./style.less";
// import Demo from "./demo.vue";
import Demo from "./table.vue";
import { createApp as create } from "vue";

import type { App } from "vue";

function App() {
  const app: App = create(Demo);
  app.mount("#app");
}

setTimeout(App);
