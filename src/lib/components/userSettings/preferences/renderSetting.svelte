<script lang="ts" generics="ValueType extends boolean | string | number">
  import Loader from "$com/loader.svelte";
  import { PUBLIC_API_BASE } from "$env/static/public";

  import type { Writable } from "svelte/store";

  export let setting: {
    title: string;
    description: string;
    serverName: string;
    values: {
      name: string;
      value: ValueType;
    }[];
    store: Writable<ValueType>;
  };

  $: settingStore = setting.store;

  let request: Promise<unknown> = Promise.resolve();

  async function updateSetting(newState: ValueType) {
    const r = fetch(`${PUBLIC_API_BASE}/my/user/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [setting.serverName]: newState }),
    });

    const timeout = setTimeout(() => (request = r), 200);

    const response = await r;

    clearTimeout(timeout);

    if (response.ok) {
      settingStore.set(newState);
    }
  }

  async function changeSetting(newVal: ValueType) {
    if (newVal === $settingStore) return;
    updateSetting(newVal);
  }
</script>

<section
  class="
    @container
  "
>
  <div
    class="
    flex gap-4 flex-col @md:flex-row justify-between
  "
  >
    <header>
      <h3 class="text-lg sm:text-xl font-bold">{setting.title}</h3>
      <p class="sm:text-sm text-xs italic">{setting.description}</p>
    </header>

    {#await request}
      <Loader rows={1} containerClass="!items-start" class="w-28 h-8" />
    {:then}
      <section class="flex gap-2">
        {#each setting.values as { name, value }}
          <button
            on:click={() => changeSetting(value)}
            class="
              px-5 h-10 @md:px-4 @md:h-12
              text-xs sm:text-sm md:text-base
              border border-surface-400
              first:rounded-l-sm last:rounded-r-sm

              {$settingStore === value
              ? 'bg-primary-500/30 hover:bg-primary-500/40'
              : 'dark:bg-surface-500/50 hover:bg-surface-50 dark:hover:bg-surface-500/80'}

              active:scale-95
              transition-all
          ">{name}</button
          >
        {/each}
      </section>
    {/await}
  </div>
</section>
