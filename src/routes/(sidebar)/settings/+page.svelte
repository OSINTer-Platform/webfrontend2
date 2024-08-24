<script lang="ts">
  import Fa from "svelte-fa";
  import PreferencePanel from "$com/userSettings/preferences/index.svelte";
  import SubscriptionPanel from "$com/userSettings/subscriptions/index.svelte";
  import Header from "$com/userSettings/header/index.svelte";
  import CodeSubmit from "$com/userSettings/subscriptions/codeSubmit.svelte";

  import type { PageData } from "./$types";

  import {
    faCircleDollarToSlot,
    faRightFromBracket,
    faSliders,
  } from "@fortawesome/free-solid-svg-icons";
  import { modalState } from "$shared/state/modals";
  import { enhance } from "$app/forms";

  export let data: PageData;

  $: user = data.userContents;
</script>

<main class="bg-surface-100 dark:bg-surface-900 w-full h-full overflow-y-auto">
  <div
    class="
      p-2 sm:p-6 md:p-10 xl:p-16
      gap-2 sm:gap-6 md:gap-10 xl:gap-16
      max-w-6xl mx-auto flex flex-col
    "
  >
    <section>
      <Header {user} />
    </section>

    <section>
      <header>
        <main>
          <Fa icon={faSliders} class="text-xl" />
          Preferences
        </main>
      </header>

      <main>
        <PreferencePanel />
      </main>
    </section>
    <section>
      <header class="grow">
        <main>
          <Fa icon={faCircleDollarToSlot} class="text-xl" />
          Subscription
        </main>
        <aside>
          <button
            title={user.premium.status ? "You already have premium access" : ""}
            disabled={user.premium.status}
            on:click={() =>
              modalState.append({
                modalType: "custom",
                modalContent: {
                  data: null,
                  component: CodeSubmit,
                },
              })}>Submit code</button
          >
        </aside>
      </header>

      <main>
        <SubscriptionPanel {user} />
      </main>
    </section>

    <form
      method="POST"
      action="/logout"
      use:enhance
      class="flex flex-col justify-center"
    >
      <button
        title="Logout"
        type="submit"
        class="
            btn rounded-sm h-32 grow
            inline-flex items-center justify-center
            transition-all duration-300
            bg-primary-400/20
        "
      >
        <Fa icon={faRightFromBracket} class="text-4xl text-primary-500" />
      </button>
    </form>
  </div>
</main>

<style lang="postcss">
  section {
    @apply bg-surface-50 dark:bg-white/10;
    header {
      @apply flex border-b border-surface-400;

      main {
        @apply grow p-4 flex items-center gap-4 text-2xl font-bold;
      }

      aside {
        button {
          @apply h-full p-4 flex items-center
          font-bold border-l border-surface-400
          hover:bg-surface-400/20 disabled:opacity-50
          active:scale-95 disabled:active:scale-100 transition-all
          disabled:cursor-not-allowed;
        }
      }
    }

    main {
      @apply px-6 py-8;
    }
  }
</style>
