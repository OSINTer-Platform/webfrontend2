<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";
  import type { ArticleListRender } from "$shared/types/internal";

  import { onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";

  import { browser } from "$app/environment";
  import { PUBLIC_API_BASE } from "$env/static/public";

  import Large from "./component/large.svelte";
  import Title from "./component/title.svelte";
  import type { Collection, User } from "$shared/types/userItems";

  export let articles: ArticleBase[] = [];
  export let layout: ArticleListRender = "large";

  const layouts: { [articleListRender in ArticleListRender]: any } = {
    large: Large,
    title: Title,
  };

  let userCollections: Writable<{ [key: string]: Collection }> = writable({});

  onMount(async () => {
    if (browser) {
      const rUser = await fetch(`${PUBLIC_API_BASE}/auth/status`);

      if (!rUser.ok) return;

      const rCollection = await fetch(`${PUBLIC_API_BASE}/my/collections/list`);

      if (!rCollection.ok) return;

      const user: User = await rUser.json();
      const collections: { [key: string]: Collection } =
        await rCollection.json();

      $userCollections = Object.fromEntries(
        Object.entries(collections).filter(
          ([_, collection]) => collection.owner == user._id
        )
      );
    }
  });
</script>

<svelte:component this={layouts[layout]} {articles} {userCollections} />
