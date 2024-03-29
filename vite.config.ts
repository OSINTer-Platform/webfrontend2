import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";

export default ({ mode }: any) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [sveltekit()],

    server: {
      proxy: {
        "/api/": {
          target: process.env.VITE_API_TARGET,
          secure: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/elastic-articles/": {
          target: process.env.VITE_ELASTIC_ARTICLES_TARGET,
          secure: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/elastic-articles/, ""),
        },
      },
    },
  });
};
