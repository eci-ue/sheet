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
                    target: 'https://lint.eci.games',
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
