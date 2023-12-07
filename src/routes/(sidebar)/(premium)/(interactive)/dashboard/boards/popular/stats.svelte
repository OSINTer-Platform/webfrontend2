<script lang="ts">
  import ModalLink from "$com/modalLink.svelte";
  import Clusters from "./clusters.svelte";

  import type { ArticleBase, ClusterBase } from "$shared/types/api";

  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import Loader from "$com/loader.svelte";

  export let articles: ArticleBase[];

  let clusters: Promise<ClusterBase[]> = Promise.resolve([]);

  async function getClusters(): Promise<ClusterBase[]> {
    const r = await fetch(`${PUBLIC_API_BASE}/ml/clusters?complete=false`);

    if (r.ok) {
      return await r.json();
    } else if (r.status === 401) {
      throw "You don't have access to topics list";
    } else {
      throw "Error when fetching topics list";
    }
  }

  onMount(() => {
    if (browser) {
      clusters = getClusters();
    }
  });

  $: readArticles = [...articles].sort((a, b) => b.read_times - a.read_times);
</script>

<section
  class="empty:hidden shrink grow basis-0 min-h-0 flex flex-col justify-center"
>
  {#await clusters}
    <Loader text="Loading topics" />
  {:then clusters}
    <Clusters {articles} {clusters} />
  {:catch e}
    <h2 class="text-center dark:text-white font-bold text-2xl">{e}</h2>
  {/await}
</section>

<section class="shrink grow basis-0 min-h-0 flex flex-col">
  <h2 class="text-2xl font-bold dark:text-white mb-2">Popular articles:</h2>

  <ul class="flex flex-col shrink gap-4 overflow-y-scroll">
    {#each readArticles as { id, title, read_times }}
      <ModalLink articleId={id} articleList={readArticles}>
        <li
          class="
            flex justify-between gap-8
            w-full p-4
            border border-primary-500
            dark:text-white leading-6
            truncate

            hover:bg-primary-400/20
          "
        >
          <span class="shrink truncate">{title}</span>
          <span>Read {read_times} times</span>
        </li>
      </ModalLink>
    {/each}
  </ul>
</section>
