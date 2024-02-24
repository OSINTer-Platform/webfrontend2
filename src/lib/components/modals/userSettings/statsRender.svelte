<script lang="ts">
  import { page } from "$app/stores";
  import type { User } from "$shared/types/userItems";

  $: alreadyRead = $page.data.alreadyRead;
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
      Premium access:
      <span class="capitalize font-bold">
        {user.premium > 0}
      </span>
    </li>
    <li>
      <span class="font-bold">{user.feed_ids.length}</span>
      feeds and
      <span class="font-bold">{user.collection_ids.length}</span> collections
    </li>
    <li>
      <span class="font-bold">{$alreadyRead?.ids.length ?? 0}</span>
      already read articles
    </li>
  </ul>
{/if}
