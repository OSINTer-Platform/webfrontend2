<script lang="ts">
  import { Elements, PaymentElement } from "svelte-stripe";
  import Email from "$com/utils/inputs/email.svelte";
  import Fa from "svelte-fa";

  import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
  import { faSpinner } from "@fortawesome/free-solid-svg-icons";
  import { modalState } from "$shared/state/modals";
  import { page } from "$app/stores";
  import { slide } from "svelte/transition";

  import type { Stripe, StripeElements } from "@stripe/stripe-js";

  export let onSubmit: () => string | undefined | Promise<string | undefined>;

  export let stripe: Stripe;
  export let elements: StripeElements;
  export let elementsMode: "payment" | "setup" | "subscription" | undefined =
    undefined;

  export let price: {
    amount: number | undefined;
    currency: string | undefined;
  } = { amount: undefined, currency: undefined };
  export let clientSecret: string | undefined = undefined;

  export let collectEmail: boolean;
  export let email = "";
  export let emailError = false;

  export let submitText = "Pay";

  let processingPayment = false;
  let paymentError: undefined | string = undefined;

  $: darkMode = $page.data.settings.darkMode;

  const showEmailInfoModal = () =>
    modalState.append({
      modalType: "info",
      modalContent: {
        title: "What do we use your email for?",
        description: [
          "When signing up to a paid subscription for OSINTer Pro we require your email to ensure easy contact regarding financial matters. This could be regarding failure of automatic subscription renewal, a need to update your payment method or anything else requiring action on your part.",
          "Do not worry though. Easy, one-click unsubscription from these are possible.",
        ],
      },
    });

  async function submit() {
    processingPayment = true;
    paymentError = undefined;
    paymentError = await onSubmit();
    processingPayment = false;
  }
</script>

<form on:submit|preventDefault={submit}>
  {#if collectEmail}
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="stripe-input relative mb-3 block">
      Email
      <div class="relative" class:error={emailError}>
        <Email
          placeholder="your@email.com"
          bind:value={email}
          bind:error={emailError}
        />

        <button
          on:click={showEmailInfoModal}
          title="Why do we need your email?"
          type="button"
          class="
            absolute right-4 top-1/2 -translate-y-1/2

            text-lg

            transition-colors
            duration-300

            text-surface-400/50
            hover:text-primary-600/75

            link-underline
          "
        >
          <Fa icon={faQuestionCircle} class="my-0.5" />
        </button>
      </div>

      {#if emailError}
        <p class="error" transition:slide|local>
          Your email address is invalid
        </p>
      {/if}
    </label>
  {/if}

  <Elements
    {stripe}
    {clientSecret}
    mode={elementsMode}
    amount={price.amount}
    currency={price.currency}
    theme={$darkMode ? "night" : "stripe"}
    labels="above"
    variables={{ colorPrimary: "#D4163C66" }}
    rules={{ ".Input": { border: "solid 1px #0002" } }}
    bind:elements
  >
    <PaymentElement options={{ layout: "tabs" }} />
  </Elements>

  <button
    disabled={processingPayment}
    class="
    w-full mt-4 h-16 rounded-sm
    shadow shadow-gray-400 dark:shadow-black
    bg-primary-500/40 hover:bg-primary-500/50
    active:scale-95 transition-all duration-300
    font-bold text-lg
  "
  >
    {#if processingPayment}
      <Fa icon={faSpinner} class="animate-spin mx-auto" />
    {:else}
      {submitText}
    {/if}
  </button>

  {#if paymentError}
    <p
      class="
      text-center text-error-500 font-light sm:text-lg mt-2 leading-tight
      "
    >
      {paymentError}
    </p>
  {/if}
</form>
