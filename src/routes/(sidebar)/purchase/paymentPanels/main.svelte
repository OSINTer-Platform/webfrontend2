<script lang="ts">
  import type { Stripe } from "@stripe/stripe-js";
  import type { PriceCalculation } from "$shared/types/stripe";
  import type { PriceLookupKey } from "$shared/types/userItems";
  import type { PaymentType } from "../common";

  import Personal from "./personal/index.svelte";
  import Enterprise from "./enterprise.svelte";
  import Loader from "$com/loader.svelte";
  import PaymentInfo from "./paymentInfo.svelte";
  import ResultPanel from "../resultPanel.svelte";

  import { isPaymentType, paymentTypes } from "../common";
  import { updatable } from "$lib/common/customStores";
  import { PUBLIC_API_BASE } from "$env/static/public";

  export let stripe: null | Promise<null | Stripe>;
  export let plan: string | null;

  async function getPrice(
    priceKey: PriceLookupKey
  ): Promise<PriceCalculation | null> {
    const r = await fetch(
      `${PUBLIC_API_BASE}/payment/price/calc/${encodeURIComponent(priceKey)}`
    );

    if (r.ok) return r.json();
    else return null;
  }

  const basePrice = updatable(() => getPrice("base-month"));
  const proPrice = updatable(() => getPrice("pro-month"));

  let selectedType: PaymentType = plan && isPaymentType(plan) ? plan : "base";

  $: selectedPrice = selectedType === "base" ? basePrice : proPrice;
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
          {#await $selectedPrice}
            <Loader text="Loading payment components" />
          {:then price}
            {#if price}
              <Personal
                {stripe}
                {price}
                level={selectedType}
                on:addressChange={() => selectedPrice.autoUpdate()}
              />
            {:else}
              <ResultPanel
                status="error"
                msg="Unknown error occurred when loading price"
              />
            {/if}
          {/await}
        {/if}
      {/await}
    {:else}
      <Loader text="Loading payment info" />
    {/if}
  {:else}
    <Enterprise />
  {/if}
</section>
