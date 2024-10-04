<script lang="ts">
  import type {
    PaymentMethodCreateParams,
    Stripe,
    StripeElements,
  } from "@stripe/stripe-js";

  import { page } from "$app/stores";
  import { createEventDispatcher, onMount } from "svelte";
  import { PUBLIC_API_BASE } from "$env/static/public";

  import StripeForm from "$com/stripe/index.svelte";
  import { faAddressBook } from "@fortawesome/free-solid-svg-icons";

  export let stripe: Stripe;
  export let price: { id: string; amount: number; currency: string };

  let elements: StripeElements;

  let email = "";
  let emailError = false;

  let stripeMode: {
    payment?: "shown";
    address?: "hidden" | "shown";
  } = { address: "shown" };

  $: user = $page.data.user;

  const paymentBtns = [
    {
      title: "Change address",
      icon: faAddressBook,
      action: () => (stripeMode = { address: "shown" }),
    },
  ];

  const dispatch = createEventDispatcher<{
    addressSuccess: undefined;
    paymentSuccess: undefined;
  }>();

  async function addressSubmit() {
    const addr = elements.getElement("address");
    if (!addr) return "An unknown error occurred. Please contact support";

    const elSub = await elements.submit();
    if (elSub.error) {
      if (
        elSub.error.type === "validation_error" ||
        elSub.error.type === "card_error"
      )
        return elSub.error.message;
      else return "An unknown error occurred. Please try again";
    }

    const values = await addr.getValue();

    const addrUpdate = await fetch(
      `${PUBLIC_API_BASE}/my/user/payment/address`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values.value.address,
          customer_name: values.value.name,
        }),
      }
    );

    const response = await addrUpdate.json();

    if (!addrUpdate.ok) {
      return response["detail"];
    } else {
      user.set(response);
    }

    dispatch("addressSuccess");
    return undefined;
  }

  async function paymentSubmit() {
    if (!elements || emailError) return;
    elements.submit();

    if (!$user?.payment.address)
      return "Your address is missing. Please contact support";

    const content: { [key: string]: string } = { price_id: price.id };

    content["email"] = email;

    const r = await fetch(`${PUBLIC_API_BASE}/my/user/payment/subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        price_id: price.id,
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

    const address: PaymentMethodCreateParams.BillingDetails.Address = {
      city: $user.payment.address.city,
      country: $user.payment.address.country,
      line1: $user.payment.address.line1,
      line2: $user.payment.address.line2,
      postal_code: $user.payment.address.postal_code,
      state: $user.payment.address.state,
    };

    const { error } = await confirmIntent({
      elements,
      clientSecret: rData.client_secret,
      redirect: "always",
      confirmParams: {
        return_url: $page.url.href,
        payment_method_data: {
          billing_details: {
            address,
            email,
            name: $user.payment.address.customer_name,
            phone: "",
          },
        },
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error")
        return error.message;
      else return "An unknown error occurred. Please try again";
    }

    dispatch("paymentSuccess");
    return undefined;
  }

  onMount(() => {
    return user.subscribe((u) => {
      if (u?.payment.address) {
        stripeMode = { payment: "shown" };
      }
    });
  });
</script>

<StripeForm
  bind:elements
  bind:email
  bind:emailError
  collectEmail={true}
  elementsMode={"subscription"}
  mode={stripeMode}
  {addressSubmit}
  {paymentSubmit}
  {paymentBtns}
  price={{
    amount: price.amount,
    currency: price.currency,
  }}
  {stripe}
/>
