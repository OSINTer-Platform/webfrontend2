<script lang="ts">
  import type {
    PaymentMethodCreateParams,
    Stripe,
    StripeElements,
    StripeError,
  } from "@stripe/stripe-js";

  import StripeForm from "$com/stripe/index.svelte";
  import Modal from "./modal.svelte";
  import Loader from "$com/loader.svelte";

  import { loadStripe } from "@stripe/stripe-js";
  import { onMount } from "svelte";
  import { PUBLIC_API_BASE, PUBLIC_STRIPE_KEY } from "$env/static/public";

  import { page } from "$app/stores";
  import { modalState } from "$shared/state/modals";
  import { formatPrice } from "$lib/common/strings";

  export let title: string | undefined = undefined;
  export let clientSecret: string | undefined = undefined;
  export let modalId: string;

  $: user = $page.data.user;

  let elements: StripeElements;
  let stripeDetails: Promise<{
    stripe: Stripe;
    clientSecret: string;
    price: { amount: number; currency: string };
  }> | null = null;

  let email = "";
  let emailError = false;

  async function getStripe() {
    const stripe = await loadStripe(PUBLIC_STRIPE_KEY);
    if (!stripe) throw new Error("Failure when loading stripe");
    return stripe;
  }

  async function getClientSecret() {
    if (clientSecret) return clientSecret;
    const newClientSecret: string = await fetch(
      `${PUBLIC_API_BASE}/my/user/payment/action/payment-intent`
    ).then(async (r) => {
      if (r.ok) return (await r.json()).client_secret;
      else {
        const error = (await r.json()).detail;
        throw new Error(`Failed to load payment intent: "${error}"`);
      }
    });

    clientSecret = newClientSecret;
    return newClientSecret;
  }

  async function getStripeDetails(): Promise<{
    stripe: Stripe;
    clientSecret: string;
    price: { amount: number; currency: string };
  }> {
    const [stripe, newClientSecret] = await Promise.all([
      getStripe(),
      getClientSecret(),
    ]);
    const paymentIntent = await stripe.retrievePaymentIntent(newClientSecret);
    if (!paymentIntent.paymentIntent)
      throw new Error("Failure when loading payment intent");

    return {
      stripe,
      clientSecret: newClientSecret,
      price: {
        amount: paymentIntent.paymentIntent.amount,
        currency: paymentIntent.paymentIntent.currency,
      },
    };
  }

  onMount(() => {
    stripeDetails = getStripeDetails();
  });

  async function paymentSubmit() {
    function handleError(error: StripeError | undefined) {
      if (error) {
        if (error.type === "card_error" || error.type === "validation_error")
          return error.message;
        else return "An unknown error occurred. Please try again";
      }
    }

    if (!stripeDetails || !elements) {
      return "An unknown error occurred during initialization. If error persists, please contact support";
    }

    if (!$user?.payment.address) {
      return "User is missing address. Please contact support";
    }

    const { stripe, clientSecret } = await stripeDetails;

    const valError = handleError((await elements.submit()).error);
    if (valError) return valError;

    const address: PaymentMethodCreateParams.BillingDetails.Address = {
      city: $user.payment.address.city,
      country: $user.payment.address.country,
      line1: $user.payment.address.line1,
      line2: $user.payment.address.line2,
      postal_code: $user.payment.address.postal_code,
      state: $user.payment.address.state,
    };

    const r = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: $page.url.origin,
        payment_method_data: {
          billing_details: {
            address,
            email,
            name: $user.payment.address.customer_name,
            phone: "",
          },
        },
      },
      redirect: "always",
    });

    const confirmError = handleError(r.error);
    if (confirmError) return confirmError;

    modalState.append({
      modalType: "info",
      modalContent: {
        title: "Success!",
        description:
          "Your default payment method has been updated to keep your OSINTer subscription active. Thank you!",
      },
    });

    modalState.remove(modalId);
  }
</script>

<Modal
  class="
    p-6 shrink-0
    w-[30rem] max-w-[90vw] max-h-[90vh]
    flex flex-col
    overflow-y-auto

    bg-surface-100 dark:bg-surface-800
  "
>
  <h1
    class="
    pb-1 mb-4 block border-b border-surface-500
    font-bold
    text-xl sm:text-3xl
  "
  >
    {title ?? "Enter new credentials"}
  </h1>

  {#if stripeDetails}
    {#await stripeDetails}
      <Loader text="Loading payment options" containerClass="my-14" />
    {:then { stripe, clientSecret, price }}
      <div
        class="
          py-6 mb-8
          rounded-xl text-center
          bg-white dark:bg-gray-900
          shadow shadow-gray-400 dark:shadow-black
        "
      >
        <h2 class="text-5xl sm:text-6xl font-bold my-4">
          {formatPrice(price.amount / 100, price.currency)}<span
            class="text-base sm:text-xl font-light">/mo</span
          >
        </h2>

        <p class="font-bold text-xs sm:text-sm">Cancel anytime</p>
        <p class="font-light text-xs sm:text-sm">Billed montly.</p>
      </div>

      <StripeForm
        bind:email
        bind:emailError
        bind:elements
        collectEmail={true}
        {clientSecret}
        mode={{ payment: "shown" }}
        {stripe}
        submitText={{ payment: "Cornfirm" }}
        {paymentSubmit}
      />
    {:catch msg}
      <p>An error occured:</p>
      <p>{msg}</p>
    {/await}
  {/if}
</Modal>
