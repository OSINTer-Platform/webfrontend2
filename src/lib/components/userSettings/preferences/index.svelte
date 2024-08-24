<script lang="ts">
  import ExternalSetting from "./externalSetting.svelte";
  import RenderSetting from "./renderSetting.svelte";

  import { ListRenderModes } from "$shared/config";
  import { page } from "$app/stores";

  $: listRenderMode = $page.data.settings.listRenderMode;
  $: darkMode = $page.data.settings.darkMode;
</script>

<ExternalSetting />

<hr />

<RenderSetting
  setting={{
    title: "Article list render mode",
    description: "Controls how list of articles is rendered",
    serverName: "list_render_mode",
    values: ListRenderModes,
    store: listRenderMode,
  }}
/>

<hr />

<RenderSetting
  setting={{
    title: "Light/Dark mode",
    description: "Change color scheme for interface",
    serverName: "dark_mode",
    values: [
      { name: "Dark", value: true },
      { name: "Light", value: false },
    ],
    store: darkMode,
  }}
/>

<style lang="postcss">
  hr {
    @apply border-surface-400/25 my-8;
  }
</style>
