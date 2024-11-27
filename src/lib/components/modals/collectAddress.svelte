<!--WIP: Haven't been tested or integrated-->
<script lang="ts">
  import type { Stripe, StripeElements } from "@stripe/stripe-js";

  import Modal from "./modal.svelte";
  import StripeForm from "$com/stripe/index.svelte";
  import Loader from "$com/loader.svelte";

  import { loadStripe } from "@stripe/stripe-js";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { modalState } from "$shared/state/modals";
  import { contactEmail } from "$shared/config";
  import { PUBLIC_API_BASE, PUBLIC_STRIPE_KEY } from "$env/static/public";

  export let title: string | undefined;
  export let modalId: string;

  let stripe: Promise<Stripe>;
  let elements: StripeElements;
  let emailError = false;

  $: user = $page.data.user;

  async function getStripe() {
    const stripe = await loadStripe(PUBLIC_STRIPE_KEY);
    if (!stripe) throw new Error("Failure when loading stripe");
    return stripe;
  }

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

    const addrUpdateResponsee = await addrUpdate.json();

    if (!addrUpdate.ok) {
      return addrUpdateResponsee["detail"];
    } else {
      user.set(addrUpdateResponsee);
    }

    const taxUpdate = await fetch(
      `${PUBLIC_API_BASE}/my/user/payment/subscription/enable-tax`
    );

    if (!taxUpdate.ok) {
      return "Error when updating subscription status";
    }

    modalState.append({
      modalType: "info",

      modalContent: {
        title: "Success!",
        description: `Your address have been updated and your OSINTer subscription will continue unchanged. Do however keep in mind that for those of you living in the EU, your monthly subscription price may have increased by up to 25% for tax reasons. To learn more, please contact [support at ${contactEmail}](mailto:${contactEmail})`,
      },
    });

    modalState.remove(modalId);
  }

  onMount(() => {
    stripe = getStripe();
  });
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
    {title ?? "Enter billing address"}
  </h1>

  {#await stripe}
    <Loader text="Loading payment options" containerClass="my-14" />
  {:then stripe}
    <StripeForm
      bind:emailError
      bind:elements
      collectEmail={true}
      mode={{ address: "shown" }}
      submitText={{ payment: "Submit" }}
      {stripe}
      {addressSubmit}
    />
  {:catch msg}
    <p>An error occured:</p>
    <p>{msg}</p>
  {/await}
</Modal>
