<script lang="ts">
  import type { Appearance, Stripe, StripeElements } from "@stripe/stripe-js";
  import type { SideButtons, SubmissionState } from "./shared";

  import Payment from "./payment.svelte";
  import Address from "./address.svelte";

  import { page } from "$app/stores";

  type Submit = (
    el: StripeElements
  ) => string | undefined | Promise<string | undefined>;

  export let paymentSubmit: Submit | undefined = undefined;
  export let addressSubmit: Submit | undefined = undefined;

  export let paymentBtns: SideButtons = undefined;
  export let addressBtns: SideButtons = undefined;

  export let stripe: Stripe;
  export let elementsMode: "payment" | "setup" | "subscription" | undefined =
    undefined;

  export let price: {
    amount: number | undefined;
    currency: string | undefined;
  } = { amount: undefined, currency: undefined };
  export let clientSecret: string | undefined = undefined;

  export let email = "";
  export let emailError = false;
  export let collectEmail: boolean;

  export let submitText: { address?: string; payment?: string } | undefined =
    undefined;

  export let mode: {
    payment?: "hidden" | "shown";
    address?: "hidden" | "shown";
  };

  let submissionState: SubmissionState = undefined;

  $: darkMode = $page.data.settings.darkMode;

  let stripeAppearance: Appearance;
  $: stripeAppearance = {
    theme: $darkMode ? "night" : "stripe",
    labels: "above",
    variables: { colorPrimary: "#D4163C66" },
    rules: { ".Input": { border: "solid 1px #0002" } },
  };

  export let elements: StripeElements;
  $: elements = clientSecret
    ? stripe.elements({
        clientSecret,
        appearance: stripeAppearance,
      })
    : stripe.elements({
        mode: elementsMode,
        amount: price.amount,
        currency: price.currency,
        appearance: stripeAppearance,
      });

  async function submit(fn: Submit | undefined) {
    if (!fn) return;

    submissionState = { state: "loading" };
    const err = await fn(elements);

    if (err) submissionState = { state: "error", msg: err };
    else submissionState = { state: "success" };
  }
</script>

{#if mode.payment}
  <Payment
    bind:email
    bind:emailError
    hidden={mode.payment === "hidden"}
    on:submit={() => submit(paymentSubmit)}
    options={{
      layout: "tabs",
      fields: {
        billingDetails: "never",
      },
    }}
    sideButtons={paymentBtns}
    {collectEmail}
    {elements}
    {submissionState}
    submitText={submitText?.payment ?? "Pay"}
  />
{/if}

{#if mode.address}
  <Address
    hidden={mode.address === "hidden"}
    on:submit={() => submit(addressSubmit)}
    sideButtons={addressBtns}
    {elements}
    {submissionState}
    submitText={submitText?.address ?? "Submit"}
  />
{/if}
