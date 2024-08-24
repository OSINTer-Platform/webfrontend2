<script lang="ts">
  import type { User } from "$shared/types/userItems";
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

  import {
    faList,
    faNewspaper,
    faRss,
    faUser,
  } from "@fortawesome/free-solid-svg-icons";

  import Fa from "svelte-fa";
  import ChangeCredential from "./changeCredential.svelte";
  import { modalState } from "$shared/state/modals";

  export let user: User;

  let listItems: { icon: IconDefinition; text: string; href: string }[];

  $: listItems = [
    { icon: faRss, text: `${user.feed_ids.length} Feeds`, href: "/feed" },
    {
      icon: faList,
      text: `${user.collection_ids.length} Collections`,
      href: "/feed",
    },
    {
      icon: faNewspaper,
      text: `${user.read_articles.length} Read Articles`,
      href: "/news/previously-read",
    },
  ];
</script>

<header class="flex flex-col sm:flex-row border-b border-surface-400">
  <main
    class="
      min-w-0 shrink grow flex items-center gap-4 p-4
      border-surface-400 border-b sm:border-b-0
    "
  >
    <Fa icon={faUser} class="text-2xl mt-2" />
    <h1 class="truncate text-3xl sm:text-4xl font-bold">{user.username}</h1>
  </main>
  <aside class="flex">
    <button
      on:click={() =>
        modalState.append({
          modalType: "custom",
          modalContent: {
            data: { credentialType: "password" },
            component: ChangeCredential,
          },
        })}
    >
      Change password
    </button>
    <button
      on:click={() =>
        modalState.append({
          modalType: "custom",
          modalContent: {
            data: { credentialType: "username" },
            component: ChangeCredential,
          },
        })}
    >
      Change username
    </button>
  </aside>
</header>

<main class="px-6 py-8">
  <ul class="flex flex-col gap-4">
    {#each listItems as { icon, text, href }}
      <li class="text-xl font-light">
        <a {href} class="flex items-center gap-4 link-underline w-fit">
          <Fa {icon} />
          {text}
        </a>
      </li>
    {/each}
  </ul>
</main>

<style lang="postcss">
  button {
    @apply grow sm:grow-0
    h-full p-4 flex items-center justify-center
    font-bold text-center border-surface-400
    border-l first:border-l-0 sm:first:border-l
    hover:bg-surface-400/20 active:scale-95 transition-all;
  }
</style>
