<script lang="ts">
  import type { Stripe } from "@stripe/stripe-js";
  import type { Price } from "$shared/types/stripe";

  import Personal from "./personal/index.svelte";
  import Enterprise from "./enterprise.svelte";
  import Loader from "$com/loader.svelte";
  import PaymentInfo from "./paymentInfo.svelte";

  import { isPaymentType, paymentTypes } from "../common";

  export let stripe: null | Promise<null | Stripe>;
  export let basePrice: Price;
  export let proPrice: Price;
  export let plan: string | null;




  let selectedType: PaymentType = plan && isPaymentType(plan) ? plan : "base";
</script>

<PaymentInfo {selectedType} />

<section class="flex flex-col">
  <aside
    class="
    relative mb-8 w-full h-14 sm:h-16
    bg-white dark:bg-black/25 rounded-xl
    flex
  "
  >
    <div
      class="
        absolute h-full w-1/3 p-2
        transition-transform
      "
      style="transform: translateX({paymentTypes.indexOf(selectedType) * 100}%)"
    >
      <div class="w-full h-full rounded-xl bg-primary-500/20" />
    </div>

    <div
      class="
      h-full grow
      grid grid-cols-3 items-center
    "
    >
      {#each paymentTypes as paymentType}
        <label
          class="
          h-full flex items-center justify-center
          text-center capitalize font-bold
          text-sm sm:text-base
          rounded-xl cursor-pointer
        "
        >
          <input
            type="radio"
            value={paymentType}
            bind:group={selectedType}
            class="hidden"
          />
          {paymentType}
        </label>
      {/each}
    </div>
  </aside>

  {#if selectedType === "base" || selectedType === "pro"}
    {#if stripe}
      {#await stripe}
        <Loader text="Loading payment components" />
      {:then stripe}
        {#if stripe}
          {#key selectedType}
            <Personal
              {stripe}
              price={selectedType === "base" ? basePrice : proPrice}
              level={selectedType}
            />
          {/key}
        {/if}
      {/await}
    {:else}
      <Loader text="Loading payment info" />
    {/if}
  {:else}
    <Enterprise />
  {/if}
</section>
