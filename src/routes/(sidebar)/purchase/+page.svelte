<script lang="ts">
  import { loadStripe } from "@stripe/stripe-js";
  import { onMount } from "svelte";
  import { PUBLIC_STRIPE_KEY } from "$env/static/public";

  import type { Stripe } from "@stripe/stripe-js";
  import type { PageData } from "./$types";

  import PaymentPanel from "./paymentPanels/main.svelte";

  export let data: PageData;
  let stripe: null | Promise<Stripe | null> = null;

  onMount(() => {
    stripe = loadStripe(PUBLIC_STRIPE_KEY);
  });
</script>

<div
  class="flex w-full h-full bg-surface-100 dark:bg-surface-800 overflow-y-auto"
>
  <main
    class="
    h-fit m-auto p-6 xl:px-0
    grow

    xl:py-16
    2xl:max-w-7xl xl:max-w-6xl max-w-2xl
    xl:grid xl:grid-cols-2
    divide-surface-400/25 xl:divide-x

    2xl:[&>*]:px-24 xl:[&>*]:px-12
    xl:first:[&>section]:pl-0 xl:last:[&>*]:pr-0
  "
  >
    <PaymentPanel {stripe} plan={data.plan} />
  </main>
</div>
