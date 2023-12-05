<script lang="ts">
  import { page } from "$app/stores";
  import {
    faArrowUpRightDots,
    faListUl,
  } from "@fortawesome/free-solid-svg-icons";

  import type { Dashboards } from "$shared/types/internal";
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

  import Fa from "svelte-fa";

  const navOptions: {
    name: Dashboards;
    title: string;
    icon: IconDefinition;
  }[] = [
    {
      name: "popular",
      title: "See popular articles and topics",
      icon: faArrowUpRightDots,
    },
    {
      name: "title",
      title: "Get just a list of new articles",
      icon: faListUl,
    },
  ];
</script>

<div
  class="
  flex rounded-full

  bg-black opacity-5
  transition-color duration-300
  px-4
"
>
  {#each navOptions as { name, title, icon }}
    <a
      {title}
      href={`/dashboard/${name}`}
      class="
      btn
      my-auto w-10 aspect-square
      text-white
    "
    >
      <Fa
        {icon}
        class={$page.params.dashboard === name ? "text-primary-500" : ""}
      />
    </a>
  {/each}
</div>
