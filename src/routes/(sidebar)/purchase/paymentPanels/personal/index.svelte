<script lang="ts">
  import type { Stripe } from "@stripe/stripe-js";
  import type { Price } from "$shared/types/stripe";
  import type { SubscriptionLevel } from "$shared/types/userItems";

  import StripeForm from "./stripeForm.svelte";
  import Loader from "$com/loader.svelte";
  import ResultPanel from "../../resultPanel.svelte";

  import { page } from "$app/stores";
  import { contactEmail } from "$shared/config";
  import { modalState } from "$shared/state/modals";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { invalidateAll } from "$app/navigation";
  import { getReadableDate } from "$lib/common/math";
  import { capitalize, formatPrice } from "$lib/common/strings";

  export let stripe: Stripe;
  export let price: Price;
  export let level: SubscriptionLevel;

  let paymentStatus: Promise<PaymentStatus> | undefined;
  let statusCheckTimeout: ReturnType<typeof setTimeout>;
  let showSubscriptionState = true;
  let subscriptionChange: null | Promise<string> = null;

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

  async function changeSubscription() {
    const r = await fetch(
      `${PUBLIC_API_BASE}/my/user/payment/subscription/change`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(price.id),
      }
    );

    if (r.ok) {
      setTimeout(() => invalidateAll(), 5000);
      return "Successfully updated subscription";
    } else {
      throw (await r.json())["detail"];
    }
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
  $: subName = $user ? capitalize($user.payment.subscription.level) : null;
  $: endDate = getReadableDate(
    ($user?.payment.subscription.current_period_end ?? 0) * 1000
  );
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
    {formatPrice(price.unit_amount / 100, price.currency)}<span
      class="text-xl font-light">/mo</span
    >
  </h2>

  <p class="font-bold text-sm">Cancel anytime</p>
  <p class="font-light text-sm">Billed monthly.</p>
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
{:else if !$user}
  <ResultPanel status="warning" msg="You need to be logged in to subscribe">
    You can either
    <a href="/login" class="link-option"> login </a>
    or
    <a href="/signup" class="link-option"> signup </a>
  </ResultPanel>
{:else if showSubscriptionState && $user && ($user.payment.subscription.state.length > 0 || $user.premium.status)}
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
  {:else if $user.payment.subscription.level.length > 0}
    {#if $user.payment.subscription.level === level}
      <ResultPanel
        status="success"
        msg="You are subscribed to OSINTer {subName}"
      />
    {:else if subscriptionChange}
      {#await subscriptionChange}
        <ResultPanel status="processing" msg="Updating subscription..." />
      {:then msg}
        <ResultPanel status="success" {msg} />
      {:catch msg}
        <ResultPanel status="error" {msg} />
      {/await}
    {:else}
      <ResultPanel
        status="warning"
        msg="You are subscribed to OSINTer {subName}"
      >
        <button
          on:click={() => (subscriptionChange = changeSubscription())}
          class="link-option"
        >
          Change subscription to OSINTer {capitalize(level)}
        </button>
      </ResultPanel>
    {/if}
  {:else if $user.premium.status}
    {#if $user.premium.expire_time * 1000 > Date.now() && $user.premium.expire_time * 1000 < Date.now() + 1000 * 60 * 60 * 24 * 14}
      <ResultPanel
        status="warning"
        msg="Your free access to OSINTer is about to expire"
      >
        {#if $user.premium.expire_time > 0}
          <p class="mb-2">
            This will expire on {getReadableDate(
              $user.premium.expire_time * 1000
            )}
          </p>
          <button
            on:click={() => (showSubscriptionState = false)}
            class="link-option"
          >
            Subscribe to OSINTer Pro to ensure continued access.
          </button>
        {/if}
      </ResultPanel>
    {:else}
      <ResultPanel
        status="success"
        msg="You have been granted free access to parts of the OSINTer interface"
      >
        {#if $user.premium.expire_time > 0}
          <p class="mb-2">
            This will expire on {getReadableDate(
              $user.premium.expire_time * 1000
            )}
          </p>
        {/if}
        <button
          on:click={() => (showSubscriptionState = false)}
          class="link-option"
        >
          Subscribe to OSINTer Pro anyway
        </button>
      </ResultPanel>
    {/if}
  {/if}
{:else}
  <StripeForm {stripe} personalPrice={price} />
{/if}

<style lang="postcss">
  .link-option {
    @apply inline-block
    underline hover:text-primary-500
    transition-colors duration-300;
  }
</style>
