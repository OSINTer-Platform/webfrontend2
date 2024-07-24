<script lang="ts">
  import Fa from "svelte-fa";
  import PreferencePanel from "$com/userSettings/preferences/index.svelte";

  import type { PageData } from "./$types";
  import {
    faCircleDollarToSlot,
    faList,
    faRightToBracket,
    faRss,
    faSliders,
  } from "@fortawesome/free-solid-svg-icons";
  import SubscriptionPanel from "$com/userSettings/subscription.svelte";

  export let data: PageData;

  $: user = data.userContents;
</script>

<main class="bg-surface-100 dark:bg-surface-900 w-full h-full overflow-y-auto">
  <div class="p-16 max-w-6xl mx-auto flex flex-col gap-8">
    <header class="mb-10">
      <h1 class="font-bold text-6xl mb-8">{user.username}</h1>
      <ul
        class="
        pl-4 flex flex-col gap-4
        [&>li]:flex [&>li]:items-center [&>li]:gap-4
      "
      >
        <li>
          <Fa icon={faRss} />
          {user.feed_ids.length} Feeds
        </li>
        <li>
          <Fa icon={faList} />
          {user.collection_ids.length} Collections
        </li>
      </ul>
    </header>

    <section>
      <header>
        <Fa icon={faSliders} class="text-xl" />
        Preferences
      </header>

      <main class="py-16">
        <PreferencePanel />
      </main>
    </section>
    <section>
      <div class="flex">
        <header class="grow">
          <Fa icon={faCircleDollarToSlot} class="text-xl" />
          Subscription
        </header>
        <a
          href="/purchase"
          class="
            flex items-center p-4 font-bold
            border-l border-b border-surface-400
            hover:bg-surface-400/20 transition-all
          "
        >
          Subscribe
        </a>
      </div>

      <main>
        <SubscriptionPanel {user} />
      </main>
    </section>
  </div>
</main>

<style lang="postcss">
  section {
    @apply bg-surface-50 dark:bg-white/10 mb-10;
    header {
      @apply p-4 flex items-center gap-4 text-2xl font-bold
      border-b border-surface-400;
    }

    main {
      @apply px-6 py-8;
    }
  }
</style>
