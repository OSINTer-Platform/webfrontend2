<script lang="ts">
  import { page } from "$app/stores";
  import type { User } from "$shared/types/userItems";

  $: readArticles = $page.data.readArticles;
  export let user: User | null;
</script>

{#if user}
  <ul
    class="
    md:grid grid-cols-2 list-disc pl-6
    text-sm md:text-base
    "
  >
    <li>
      <span class=""> Username: </span>
      <span class="font-bold">
        {user.username}
      </span>
    </li>
    <li>
      Subscription:
      <span class="capitalize font-bold">
        {user.payment.subscription.level.length > 0
          ? user.payment.subscription.level
          : "None"}
      </span>
    </li>
    <li>
      <span class="font-bold">{user.feed_ids.length}</span>
      feeds and
      <span class="font-bold">{user.collection_ids.length}</span> collections
    </li>
    <li>
      <span class="font-bold">{$readArticles?.length ?? 0}</span>
      already read articles
    </li>
  </ul>
{/if}
