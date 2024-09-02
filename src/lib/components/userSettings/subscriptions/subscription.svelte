<script lang="ts">
  import type { SubscriptionLevel, User } from "$shared/types/userItems";
  import { capitalize } from "$lib/common/strings";
  import { getReadableDate } from "$lib/common/math";
  import { contactEmail } from "$shared/config";
  import { modalState } from "$shared/state/modals";

  import {
    PUBLIC_API_BASE,
    PUBLIC_PURCHASE_AVAILABLE,
  } from "$env/static/public";
  import { invalidateAll } from "$app/navigation";

  export let subName: SubscriptionLevel;
  export let user: User;

  $: subscriptionEnd = getReadableDate(
    user.payment.subscription.current_period_end * 1000
  );

  $: formattedSubName = capitalize(subName);

  const cancel = () =>
    modalState.append({
      modalType: "options",
      modalContent: {
        type: "warning",
        title: "Cancel subscription?",
        description: `Are you sure you want to cancel your subscription of OSINTer ${formattedSubName}? Your access post-cancellation will last until next payment date. If you are having problems, then you can also [contact support](mailto:${contactEmail})`,
        options: async () => {
          const r = await fetch(
            `${PUBLIC_API_BASE}/my/user/payment/subscription`,
            {
              method: "DELETE",
            }
          );

          if (r.ok) {
            modalState.append({
              modalType: "info",
              modalContent: {
                title: "Successfully cancelled",
                description: `We have successfully cancelled your OSINTer ${formattedSubName} subscription! If you have time, we would love for you to leave us a little bit of feedback on why you chose to cancel at [${contactEmail}](mailto:${contactEmail})`,
              },
            });

            setTimeout(() => invalidateAll(), 5000);

            return true;
          }

          return false;
        },
      },
    });
</script>

<h3 class="text-lg sm:text-xl font-bold">OSINTer {formattedSubName}:</h3>
{#if user.payment.subscription.level === subName}
  {#if user.payment.subscription.cancel_at_period_end}
    <p>
      You have cancelled your OSINTer {formattedSubName} subscription. Your current
      subscription will end on {subscriptionEnd}
      You can
      {#if PUBLIC_PURCHASE_AVAILABLE}
        <a
          href="/purchase?plan={subName}"
          class="underline hover:text-primary-500 transition-colors"
        >
          renew it here
        </a>
        or you can
      {/if}
      <a
        href="mailto:{contactEmail}"
        class="underline hover:text-primary-500 transition-colors"
      >
        contact support
      </a>
      if you believe this is an error.
    </p>
  {:else}
    <p>
      You are subscribed to OSINTer {formattedSubName}. You can
      <button on:click={cancel}>cancel your subscription here</button> or
      {#if user.payment.invoice.invoice_url.length > 0}
        <a
          href={user.payment.invoice.invoice_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          see your last invoice here
        </a>
      {/if}
    </p>
  {/if}
{:else}
  <p>
    {#if user.payment.subscription.level.length > 0}
      You are not subscribed to OSINTer {formattedSubName}, but instead OSINTer {capitalize(
        user.payment.subscription.level
      )}.
      <a href="/purchase?plan={subName}"
        >Change your subscription to OSINTer {formattedSubName}</a
      >
    {:else}
      You are not subscribed to OSINTer {formattedSubName}.
      <a href="/purchase?plan={subName}">Subscribe here</a>
    {/if}
  </p>
{/if}

<style lang="postcss">
  a,
  button {
    @apply transition-colors hover:text-primary-500 underline;
  }

  p {
    @apply font-light;
  }
</style>
