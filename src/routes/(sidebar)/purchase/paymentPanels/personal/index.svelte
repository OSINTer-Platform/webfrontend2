<script lang="ts">
  import type { Stripe } from "@stripe/stripe-js";
  import type { Price } from "$shared/types/stripe";

  import StripeForm from "./stripeForm.svelte";
  import Loader from "$com/loader.svelte";
  import ResultPanel from "../../resultPanel.svelte";

  import { page } from "$app/stores";
  import { contactEmail } from "$shared/config";

  export let stripe: Stripe;
  export let personalPrice: Price;

  let paymentStatus: Promise<PaymentStatus> | undefined;
  let statusCheckTimeout: ReturnType<typeof setTimeout>;
  let showSubscriptionState = true;

  type PaymentStatus = {
    status: "success" | "error" | "processing";
    msg: string;
  };

  const statusOptions: {
    [key: string]: PaymentStatus;
  } = {
    succeeded: {
      status: "success",
      msg: "Payment succeeded!",
    },
    processing: {
      status: "processing",
      msg: "Your payment is processing...",
    },
    requires_payment_method: {
      status: "error",
      msg: "Your payment was unfortunately not successful.",
    },
    default: {
      status: "error",
      msg: "An unknown error occurred",
    },
  };

  async function checkStatus(clientSecret: string | null | undefined) {
    clearTimeout(statusCheckTimeout);

    if (!clientSecret) {
      paymentStatus = undefined;
      return;
    }

    paymentStatus = stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        if (!paymentIntent) return statusOptions.default;

        if (paymentIntent.status === "processing")
          statusCheckTimeout = setTimeout(
            () => checkStatus(clientSecret),
            3000
          );

        if (paymentIntent.status in statusOptions)
          return statusOptions[paymentIntent.status];
        else return statusOptions.default;
      });
  }

  $: checkStatus($page.data.paymentIntentClientSecret);

  $: user = $page.data.user;
</script>

<div
  class="
    py-6 mb-8
    rounded-xl text-center
    bg-white dark:bg-gray-900
    shadow shadow-gray-400 dark:shadow-black
  "
>
  <h2 class="text-6xl font-bold my-4">
    $15<span class="text-xl font-light">/mo</span>
  </h2>

  <p class="font-bold text-sm">Cancel anytime</p>
  <p class="font-light text-sm">Billed montly.</p>
</div>

{#if paymentStatus}
  {#await paymentStatus}
    <div class="py-16 grow">
      <Loader text="Loading payment result" />
    </div>
  {:then { status, msg }}
    <ResultPanel {status} {msg}>
      {#if status === "error"}
        <button
          on:click={() => (paymentStatus = undefined)}
          class="
          inline-block
          underline hover:text-primary-500
          transition-colors duration-300
        "
        >
          Please try again here.
        </button>
      {/if}
    </ResultPanel>
  {/await}
{:else if showSubscriptionState && $user && $user.payment.subscription.state.length > 0}
  {@const success = $user.payment.subscription.state !== "closed"}
  <ResultPanel
    status={success}
    msg={success
      ? "You are already subscriped to OSINTer Pro"
      : "Your subscription to OSINTer Pro has expired"}
  >
    {#if !success}
      You can either
      <button
        on:click={() => (showSubscriptionState = false)}
        class="
          inline-block
          underline hover:text-primary-500
          transition-colors duration-300
        "
      >
        create a new subscription
      </button>
      or
      <a
        href={`mailto:${contactEmail}`}
        class="
        inline-block
        underline hover:text-primary-500
        transition-colors duration-300
      "
      >
        contact support
      </a>
    {/if}
  </ResultPanel>
{:else}
  <StripeForm {stripe} {personalPrice} />
{/if}
