import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      $shared: "src/lib/shared",
      $state: "src/lib/shared/state",
      $com: "src/lib/components",
      $utils: "src/lib/components/utils",
      $assets: "src/lib/assets",
    },
  },
};

export default config;
