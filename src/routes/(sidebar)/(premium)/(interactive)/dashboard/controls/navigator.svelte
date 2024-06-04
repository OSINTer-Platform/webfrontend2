<script lang="ts">
  import { page } from "$app/stores";
  import {
    faArrowUpRightDots,
    faListUl,
  } from "@fortawesome/free-solid-svg-icons";

  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

  import Fa from "svelte-fa";

  export let containerClass = "";

  const navOptions: {
    href: string;
    title: string;
    icon: IconDefinition;
  }[] = [
    {
      href: "/dashboard/list",
      title: "See popular articles and topics",
      icon: faListUl,
    },
    {
      href: "/dashboard/stats",
      title: "See metrics and statistics for new articles",
      icon: faArrowUpRightDots,
    },
  ];
</script>

<div
  class="
  flex rounded-full px-4
  bg-black max-w-max
  {containerClass}
"
>
  {#each navOptions as { href, title, icon }}
    <a
      {title}
      {href}
      class="
      btn
      my-auto w-10 aspect-square
      text-white
    "
    >
      <Fa
        {icon}
        class={$page.url.pathname === href ? "text-primary-500" : ""}
      />
    </a>
  {/each}
</div>
