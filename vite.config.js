import path from "path";
import {defineConfig, loadEnv} from 'vite'
import vue from "@vitejs/plugin-vue";
import jsx from "@vitejs/plugin-vue-jsx";

export default defineConfig(function ({mode}) {
    const env = loadEnv(mode, path.resolve(__dirname));
    return {
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
            target: "esnext",
            polyfillModulePreload: false,
            lib: {
                entry: "src/index",
                name: "sheet",
                formats: ["es"],
                fileName: "sheet"
            },
            cssCodeSplit: true,
            sourcemap: true,
            manifest: false,
            rollupOptions: {
                external: [
                    /^pinia/i,
                    /^vue/i,
                    /^lodash-es/i,
                    /^@visactor/i,
                    /^@fengqiaogang/i,
                    /^@vueuse\/core/i,
                    /^@ckpack\/vue-color/i,
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
                        proxy.on("proxyReq", function (proxyReq) {
                            // 🟢 在这里添加自定义 Cookie
                            return proxyReq.setHeader("Authorization", env.VITE_TOKEN);
                        });
                    }
                },
            },
        }
    }
})
