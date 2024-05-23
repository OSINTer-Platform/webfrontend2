<script lang="ts">
  import type { Stripe } from "@stripe/stripe-js";
  import type { Price } from "$shared/types/stripe";

  import StripeForm from "./stripeForm.svelte";
  import Loader from "$com/loader.svelte";
  import ResultPanel from "../../resultPanel.svelte";

  import { page } from "$app/stores";
  import { contactEmail } from "$shared/config";
  import { modalState } from "$shared/state/modals";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { invalidateAll } from "$app/navigation";

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

  const renew = () =>
    modalState.append({
      modalType: "options",
      modalContent: {
        type: "warning",
        title: "Renew subscription?",
        description: `Do you want to renew your OSINTer ${subName} subscription? Otherwise it will end on ${endDate}`,
        options: async () => {
          const r = await fetch(
            `${PUBLIC_API_BASE}/my/user/payment/subscription/uncancel`,
            { method: "POST" }
          );

          if (r.ok) {
            modalState.append({
              modalType: "info",
              modalContent: {
                title: "Subscription renewed!",
                description: `Your OSINTer ${subName} subscription has been renewed!`,
              },
            });
            setTimeout(() => invalidateAll(), 5000);
            return true;
          }

          return false;
        },
      },
    });

  $: checkStatus($page.data.stripe.paymentIntentClientSecret);

  $: user = $page.data.user;
  $: subName = $user?.payment.subscription.level.toUpperCase();

  $: endDate = new Date(
    ($user?.payment.subscription.current_period_end ?? 0) * 1000
  ).toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
          class="link-option"
        >
          Please try again here.
        </button>
      {/if}
    </ResultPanel>
  {/await}
{:else if showSubscriptionState && $user && $user.payment.subscription.state.length > 0}
  {#if $user.payment.subscription.state === "closed"}
    <ResultPanel
      status="error"
      msg="Your OSINTer {subName} subscription has expired"
    >
      You can either
      <button
        on:click={() => (showSubscriptionState = false)}
        class="link-option"
      >
        create a new subscription
      </button>
      or
      <a href={`mailto:${contactEmail}`} class="link-option">
        contact support
      </a>
    </ResultPanel>
  {:else if $user.payment.subscription.cancel_at_period_end}
    <ResultPanel
      status="warning"
      msg="You have cancelled your OSINTer {subName} subscription"
    >
      You can either
      <button on:click={renew} class="link-option">
        renew your subscription
      </button>
      or
      <a href={`mailto:${contactEmail}`} class="link-option">
        contact support
      </a>

      Otherwise it expires on {endDate}
    </ResultPanel>
  {:else}
    <ResultPanel status="success" msg="You are subscribed to OSINTer" />
  {/if}
{:else}
  <StripeForm {stripe} {personalPrice} />
{/if}

<style lang="postcss">
  .link-option {
    @apply inline-block
    underline hover:text-primary-500
    transition-colors duration-300;
  }
</style>
