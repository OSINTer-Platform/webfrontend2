import adapter from "@sveltejs/adapter-node";
import { sveltePreprocess } from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: sveltePreprocess({ postcss: true }),

  kit: {
    adapter: adapter(),
    alias: {
      $shared: "src/lib/shared",
      $state: "src/lib/shared/state",
      $com: "src/lib/components",
      $inputs: "src/lib/components/utils/inputs",
      $assets: "src/lib/assets",
    },
  },
};

export default config;
