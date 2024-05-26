<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import {
    PUBLIC_API_BASE,
    PUBLIC_PURCHASE_AVAILABLE,
  } from "$env/static/public";
  import { getReadableDate } from "$lib/common/math";
  import { contactEmail } from "$shared/config";
  import { modalState } from "$shared/state/modals";

  import type { User } from "$shared/types/userItems";

  import SignupCode from "./signupCode.svelte";

  export let user: User;

  $: subName = user.payment.subscription.level.toUpperCase();

  const cancel = () =>
    modalState.append({
      modalType: "options",
      modalContent: {
        type: "warning",
        title: "Cancel subscription?",
        description: `Are you sure you want to cancel your subscription of OSINTer PRO? Your access post-cancellation will last until next payment date. If you are having problems, then you can also [contact support](mailto:${contactEmail})`,
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
                description: `We have successfully cancelled your OSINTer subscription! If you have time, we would love for you to leave us a little bit of feedback on why you chose to cancel at [${contactEmail}](mailto:${contactEmail})`,
              },
            });

            setTimeout(() => invalidateAll(), 5000);

            return true;
          }

          return false;
        },
      },
    });

  const spawnSignupCodePanel = () =>
    modalState.append({
      modalType: "custom",
      modalContent: { component: SignupCode },
    });
</script>

<section class="pb-6 pr-0 md:pb-0 md:pr-4 flex flex-col justify-center">
  {#if user.premium.status}
    <h3 class="font-bold text-xl">You have been granted premium access</h3>
    <p class="font-light">
      You have been granted free access to the entirety of the OSINTer interface
      {#if user.premium.expire_time > 0}
        This is access ends on {getReadableDate(
          user.premium.expire_time * 1000
        )}
      {/if}
    </p>
  {:else if user.payment.subscription.level.length > 0}
    {#if user.payment.subscription.cancel_at_period_end}
      <h3 class="font-bold text-xl">
        You have cancelled your OSINTer {subName} subscription
      </h3>
      <p class="font-light">
        <a
          href="/purchase"
          class="underline hover:text-primary-500 transition-colors"
        >
          renew it here
        </a>
        or you can
        Your current subscription will end on {getReadableDate(
          user.payment.subscription.current_period_end * 1000
        )}. You can
        <a
          href="mailto:{contactEmail}"
          class="underline hover:text-primary-500 transition-colors"
        >
          contact support
        </a>
        if you believe this is an error
      </p>
    {:else}
      <h3 class="font-bold text-xl mb-2">
        You are subscribed to OSINTer {subName}
      </h3>
      <nav class="flex gap-3 flex-wrap">
        <button class="btn" on:click={cancel}>Cancel</button>
        <a class="btn" href="mailto:{contactEmail}">Support</a>
        {#if user.payment.invoice.invoice_url.length > 0}
          <a
            class="btn"
            href={user.payment.invoice.invoice_url}
            target="_blank"
            rel="noopener noreferrer">Last invoice</a
          >
        {/if}
      </nav>
    {/if}
  {:else}
    <h3 class="font-bold text-xl mb-2">You are not subscribed to OSINTer</h3>
    <nav class="flex gap-3 flex-wrap">
      <a class="btn" href="/purchase">Subscribe</a>
      <button class="btn" on:click={spawnSignupCodePanel}>Submit code</button>
      <a class="btn" href="mailto:{contactEmail}">Support</a>
    </nav>
  {/if}
</section>

<style lang="postcss">
  h3 {
    @apply font-bold text-lg md:text-xl;
  }
  nav {
    * {
      @apply min-w-max px-4 h-12 grow basis-0
      rounded-xl font-bold
      transition-colors duration-300
      bg-primary-400/10 hover:bg-primary-400/20;
    }
  }
</style>
