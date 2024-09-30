<script lang="ts">
  import type { Price } from "$shared/types/stripe";

  import { page } from "$app/stores";
  import { PUBLIC_API_BASE } from "$env/static/public";

  import type { Stripe, StripeElements } from "@stripe/stripe-js";
  import StripeForm from "$com/stripe/index.svelte";

  export let stripe: Stripe;
  export let personalPrice: Price;

  let elements: StripeElements;

  let email = "";
  let emailError = false;

  let stripeMode: {
    payment?: "shown";
    address: "hidden" | "shown";
  } = { address: "shown" };

  $: user = $page.data.user;
  $: collectEmail = !($user && $user.payment.stripe_id.length > 0);

  async function addressSubmit() {
    const r = await elements.submit();
    if (r.error) {
      if (r.error.type === "validation_error" || r.error.type === "card_error")
        return r.error.message;
      else return "An unknown error occurred. Please try again";
    }
    stripeMode = { payment: "shown", address: "hidden" };
    return undefined;
  }

  async function paymentSubmit() {
    if (!elements || (collectEmail && emailError)) return;
    elements.submit();

    const content: { [key: string]: string } = { price_id: personalPrice.id };

    if (collectEmail) content["email"] = email;

    const r = await fetch(`${PUBLIC_API_BASE}/my/user/payment/subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        price_id: personalPrice.id,
      }),
    });

    const rData = await r.json();

    if (!r.ok) {
      if ("detail" in rData) {
        return rData.detail;
      } else {
        return "An unknown error occurred. Please try again";
      }
    }

    const confirmIntent =
      rData.type === "setup" ? stripe.confirmSetup : stripe.confirmPayment;

    const { error } = await confirmIntent({
      elements,
      clientSecret: rData.client_secret,
      redirect: "always",
      confirmParams: {
        return_url: $page.url.href,
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error")
        return error.message;
      else return "An unknown error occurred. Please try again";
    }

    return undefined;
  }
</script>

<StripeForm
  bind:elements
  bind:email
  bind:emailError
  elementsMode={"subscription"}
  mode={stripeMode}
  {addressSubmit}
  {paymentSubmit}
  price={{
    amount: personalPrice.unit_amount,
    currency: personalPrice.currency,
  }}
  {collectEmail}
  {stripe}
/>
