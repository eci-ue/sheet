import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import jsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  resolve: {
    extensions: [".ts", ".vue", ".js", ".tsx"],
    alias: {
      "src/": `${path.resolve(__dirname, "src")}/`,
      "test/": `${path.resolve(__dirname, "test")}/`,
      "types/": `${path.resolve(__dirname, "types")}/`,
    },
  },
  plugins: [vue(), jsx()],
  css: {
    preprocessorOptions: {
      css: {
        charset: false
      },
      scss: {
        additionalData: "",
      }
    }
  },
  build: {
    target: "modules",
    polyfillModulePreload: false,
    lib: {
      entry: "src/index",
      name: "message",
      formats: ["es"],
      fileName: "message"
    },
    cssCodeSplit: true,
    sourcemap: true,
    manifest: false,
    rollupOptions: {
      external: [
        /^pinia/i,
        /^vue/i,
        /^@visactor/i,
        /^@fengqiaogang/i,
        /^@@vueuse\/core/i
      ],
      output: {
        inlineDynamicImports: true
      }
    }
  },
  server: {
    proxy: {
      "/api": {
        changeOrigin: true,
        target: 'http://lqc.dev.ecigames.buzz',
        configure: function (proxy) {
          const token = `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlaWQiOiIwMDAwMHJhMnp4bTUwc3BjNnEzMXdqOW9iZ2Z5NzRuZCIsInVzZXJfbmFtZSI6InJvb3QiLCJ0eiI6Ik1hcnF1ZXNhcyBTdGFuZGFyZCBUaW1lIiwicGlkIjotMSwib2lkIjotMSwib2xkaWQiOm51bGwsImNsaWVudF9pZCI6ImxxYV9nYW1lIiwiYXR0YWNocyI6IiIsImVuYW1lIjoiTFFBIiwiaHBpZCI6bnVsbCwiYXR5cGUiOiIxIiwic2NvcGUiOlsiYWxsIl0sImRuYW1lIjoiRUNJW-i2heeuoV0iLCJleHAiOjE3NjQ4MTMzMjksInF5d3giOm51bGwsImFpZCI6IjAwMDAwMDA1eHY2ZTkwb3RkbjdobWYyYjR1c3pqcGljIiwianRpIjoiNTgwYWQ1YTAtMzhiNS00NGM4LWIzY2ItM2JjZTA4MmIzMjg3IiwiZGlkIjotMX0.jYe3GzgdJ98pEr5FwCdu3xqIBWyL_yd0Cli3_78s_bLeqZHeKL-sDxOWuxLyL7N9cWIKBby48y5GpspV79EUWZi8Gc6Q0oL2Tw5kdzvmIfBdle4RTT2qymzR4o9c56ITf9pthQRi4gYM_lKoq8W-8wCw9qgvWhmjllC4xjyJV-MWCchm8rEuj_DWJ-2V5Mqk6ITTKNyaqFKr-3U_WxM7eNMfHxAlXkS9yE8xnHZbfAeCsGWuu06tRU_4TUx_jje3ba30zpX7sLYxkz3odqfXmBCyOUbimNjKSHTOiflWo8Zgnbn_JjKhrrYMXeM7F6nGMLuvh8IOOWsA87Ob1pZwBA`;
          proxy.on("proxyReq", function (proxyReq) {
            // 🟢 在这里添加自定义 Cookie
            return proxyReq.setHeader("Authorization", token);
          });
        }
      },
    },
  }
})
