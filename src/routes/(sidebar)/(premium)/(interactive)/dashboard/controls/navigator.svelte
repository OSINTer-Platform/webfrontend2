<script lang="ts">
  import { page } from "$app/stores";
  import {
    faArrowUpRightDots,
    faListUl,
  } from "@fortawesome/free-solid-svg-icons";
  import { goto } from "$app/navigation";

  import type { Dashboards } from "$shared/types/internal";
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

  import Fa from "svelte-fa";

  export let dashboard: Dashboards;

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

  function updateDashboard(dashboard: Dashboards) {
    const url = new URL($page.url);
    url.searchParams.set("dashboard", dashboard);
    goto(url, { replaceState: true });
  }
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
    <!-- -->
    <a
      {title}
      on:click|preventDefault={() => updateDashboard(name)}
      href={`/dashboard/?dashboard=${name}`}
      class="
      btn
      my-auto w-10 aspect-square
      text-white
    "
    >
      <Fa {icon} class={dashboard === name ? "text-primary-500" : ""} />
    </a>
  {/each}
</div>
