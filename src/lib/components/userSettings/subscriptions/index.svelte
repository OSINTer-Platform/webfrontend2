<script lang="ts">
  import { getReadableDate } from "$lib/common/math";
  import type { User } from "$shared/types/userItems";
  import Subscription from "./subscription.svelte";

  export let user: User;
</script>

{#if user.premium.status}
  <h3 class="font-bold text-xl sm:text-2xl">
    You have been granted premium access
  </h3>
  <p class="font-light">
    You have been granted free access to the entirety of the OSINTer interface
  </p>
  {#if user.premium.expire_time > 0}
    <p class="font-light">
      This is access ends on <span class="font-normal"
        >{getReadableDate(user.premium.expire_time * 1000)}</span
      >
    </p>
  {/if}
  <hr />
{/if}

<Subscription {user} subName="base" />

<hr />

<Subscription {user} subName="pro" />

<style lang="postcss">
  hr {
    @apply border-surface-400/25 my-8;
  }
</style>
