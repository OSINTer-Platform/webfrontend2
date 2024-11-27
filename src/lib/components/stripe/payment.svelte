<script lang="ts">
  import type {
    StripeElements,
    StripePaymentElementOptions,
  } from "@stripe/stripe-js";
  import type { SubmissionState, SideButtons } from "./shared";

  import Email from "$com/utils/inputs/email.svelte";
  import Fa from "svelte-fa";
  import SubmitButton from "./submitBtn.svelte";

  import { modalState } from "$shared/state/modals";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";

  export let elements: StripeElements;
  export let options: StripePaymentElementOptions = {};
  export let collectEmail = true;
  export let email = "";
  export let emailError = false;

  export let submissionState: SubmissionState;
  export let submitText: string;

  export let hidden: boolean;

  export let sideButtons: SideButtons;

  let wrapper: HTMLElement;

  onMount(() => {
    const el = elements.create("payment", options);
    el.mount(wrapper);

    return () => el.destroy();
  });

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
</script>

<form on:submit|preventDefault id="paymentForm" class:hidden>
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
        <p class="error" transition:slide>Your email address is invalid</p>
      {/if}
    </label>
  {/if}
  <div bind:this={wrapper} />
  <SubmitButton {submissionState} {submitText} {sideButtons} />
</form>
