import { loadStripe } from "@stripe/stripe-js";
import { get } from "svelte/store";
import { goto, invalidateAll } from "$app/navigation";
import { modalState } from "$shared/state/modals";
import { contactEmail } from "$shared/config";
import { getReadableDate } from "$lib/common/math";
import {
  PUBLIC_API_BASE,
  PUBLIC_PURCHASE_AVAILABLE,
  PUBLIC_STRIPE_KEY,
} from "$env/static/public";

import type { PaymentIntent } from "@stripe/stripe-js";
import type { User } from "$shared/types/userItems";
import type { Writable } from "svelte/store";

async function authenticate(
  stripePromise: ReturnType<typeof loadStripe>,
  paymentIntentPromise: Promise<[boolean, string]>
) {
  const getSupportLink = (phase: string, errorMsg?: string) =>
    "You can also [contact support]" +
    `(mailto:${contactEmail}?subject=${encodeURIComponent(
      `Problem regarding payment - ${phase} | ${errorMsg ?? "Unknown"}`
    )})`;

  const getErrorMsg = (phase: string, errorMsg?: string) =>
    errorMsg
      ? `${phase} failed with the following error: "${errorMsg}".`
      : `${phase} failed due to unknown error.`;

  function displayInitError(errorMsg?: string) {
    const supportLink = getSupportLink("Initialization", errorMsg);
    const description = getErrorMsg("Initialization", errorMsg);

    modalState.append({
      modalType: "options",
      modalContent: {
        type: "error",
        title: "Authentication failed!",
        description: description + " Do you want to try again? " + supportLink,
        options: () => authenticate(stripePromise, paymentIntentPromise),
      },
    });
  }

  function displayConfirmError(errorMsg?: string) {
    const supportLink = getSupportLink("Confirmation", errorMsg);
    const errorDesc = getErrorMsg("Confirmation", errorMsg);

    modalState.append({
      modalType: "options",
      modalContent: {
        type: "error",
        title: "Confirmation failed!",
        description:
          errorDesc +
          " As such we will need new card credentials to keep your OSINTer subscription active. Do you want to update them now? " +
          supportLink,
        options: () => spawnCollectionModal(),
      },
    });
  }

  const [stripe, paymentIntent] = await Promise.all([
    stripePromise,
    paymentIntentPromise,
  ]);

  if (!stripe) return displayInitError("Stripe object didn't load properly");
  if (!paymentIntent[0]) return displayInitError(paymentIntent[1]);

  const r = await stripe.confirmCardPayment(paymentIntent[1]);

  if (r.error) {
    const errorMsg =
      r.error.type === "validation_error" || r.error.type === "card_error"
        ? r.error.message
        : undefined;

    return displayConfirmError(errorMsg);
  }

  modalState.append({
    modalType: "info",
    modalContent: {
      title: "Success!",
      description:
        "Your payment has been authorized, and your subscription will be kept active. Thank you!",
    },
  });
}

function spawnChoiceModal(
  title: string,
  description: string | string[],
  choiceTitle: string,
  choiceAction: () => void | boolean | Promise<void> | Promise<boolean>,
  remindDateStore: Writable<number>,
  invoice_url: string
) {
  modalState.append({
    modalType: "options",
    modalContent: {
      type: "warning",
      title,
      description,
      options: [
        {
          text: choiceTitle,
          type: "primary",
          action: () => choiceAction(),
        },
        {
          text: "Remind me",
          type: "secondary",
          action: () => remindDateStore.set(Date.now() + 24 * 60 * 60 * 1000),
        },
        {
          text: "View invoice",
          type: "secondary",
          action: () => {
            window.open(invoice_url, "_blank");
            return false;
          },
        },
      ],
    },
  });
}

const spawnCollectionModal = () =>
  modalState.append({
    modalType: "collect-payment",
    modalContent: {},
  });

function spawnExpiredModal(username: string) {
  async function acknowledgeExpirery() {
    const r = await fetch(
      `${PUBLIC_API_BASE}/my/user/payment/subscription/acknowledge-close`,
      { method: "POST" }
    );

    if (r.ok) {
      return true;
    } else {
      console.error(
        "Error when attempting to acknowledge expirery.",
        await r.json()
      );
      return false;
    }
  }

  modalState.append({
    modalType: "options",
    modalContent: {
      type: "warning",
      title: "Oops...",
      description:
        "Your OSINTer subscription has unfortunately been cancelled. " +
        "This is either due to you cancelling it, or problems with your payment of choice. " +
        "If you want to continue to have access, you can signup for a new subscription, " +
        "or if you believe this is an error, then you can [contact support]" +
        `(mailto:${contactEmail}?subject=${encodeURIComponent(
          `Problem regarding subscription - "${username}"`
        )})`,
      options: [
        {
          text: "Ignore",
          type: "primary",
          action: acknowledgeExpirery,
        },
        {
          text: "Signup",
          type: "secondary",
          action: () => goto("/purchase"),
        },
      ],
    },
  });
}

function showUpdateModal(user: User, remindDateStore: Writable<number>) {
  spawnChoiceModal(
    "New credentials required",
    [
      "We have failed to collect the charge from your payment method of choice for your OSINTer subscription. " +
        "As such, we require that you provide a new payment method (you can reuse the one you already use if it is valid). " +
        'Please click "Update" to update your payment method, or get us to remind you in 24 hours',
      `You can also [contact support](mailto:${contactEmail})`,
    ],
    "Update",
    () => spawnCollectionModal(),
    remindDateStore,
    user.payment.invoice.invoice_url
  );
}

function showAuthModal(user: User, remindDateStore: Writable<number>) {
  const stripePromise = loadStripe(PUBLIC_STRIPE_KEY);
  const clientSecret: Promise<[boolean, string]> = fetch(
    `${PUBLIC_API_BASE}/my/user/payment/action/payment-intent`
  ).then(
    async (r) => [true, (await r.json()).client_secret],
    async (r) => [false, (await r.json()).detail]
  );

  spawnChoiceModal(
    "Authentication required - payment",
    "It seems that your bank requires extra authentication for us to collect the montly charge for your OSINTer subscription. " +
      'Please click "Authenticate" to complete the payment, or get us to remind you in 24 hours',
    "Authenticate",
    () => authenticate(stripePromise, clientSecret),
    remindDateStore,
    user.payment.invoice.invoice_url
  );
}

function showPaymentResults(clientSecret: string, username?: string) {
  const showError = (msg: string, headerline: string) =>
    modalState.append({
      modalType: "info",
      modalContent: {
        title: "Oops...",
        description:
          `${msg}. Please [contact support]` +
          `(mailto:${contactEmail}?subject=${encodeURIComponent(headerline)})`,
      },
    });

  async function checkPaymentStatus() {
    const stripe = await loadStripe(PUBLIC_STRIPE_KEY);
    if (!stripe) {
      showError(
        "For unknown reasons we failed to load stripe",
        "Problem when loading stripe"
      );
      throw new Error("Failure when loading stripe");
    }

    let paymentIntent: PaymentIntent;
    while (true) {
      const paymentStatus = await stripe.retrievePaymentIntent(clientSecret);
      if (paymentStatus.error) {
        showError(
          "For unknown reasons we couldn't retrieve your payment result",
          `Problem retriving payment intent - ${username}`
        );
        throw new Error("Failure when retrieving payment intent");
      }
      if (paymentStatus.paymentIntent.status !== "processing") {
        paymentIntent = paymentStatus.paymentIntent;
        break;
      }
    }

    if (paymentIntent.status == "succeeded")
      modalState.append({
        modalType: "info",
        modalContent: {
          title: "Success!",
          description:
            "Your payment has been authorized, and your subscription is active. Thank you!",
        },
      });
    else
      modalState.append({
        modalType: "info",
        modalContent: {
          title: "Failure!",
          description:
            "We have unfortunately failed to update your payment details. We will get back to you with another attempt",
        },
      });
  }

  modalState.append({
    modalType: "processing",
    modalContent: { process: checkPaymentStatus() },
  });
}

const spawnPremiumExpirationModal = (user: User) => {
  async function acknowledge() {
    const r = await fetch(`${PUBLIC_API_BASE}/my/user/acknowledge-premium`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ field: "expiry", status: true }),
    });

    if (r.ok) {
      invalidateAll();
      return true;
    } else return false;
  }

  let options: {
    text: string;
    type: "primary" | "secondary";
    action: () => Promise<boolean> | void;
  }[];

  if (PUBLIC_PURCHASE_AVAILABLE) {
    options = [
      {
        text: "Subscribe",
        type: "primary",
        action: () => {
          goto("/purchase");
          return;
        },
      },
      {
        text: "Acknowledge",
        type: "secondary",
        action: acknowledge,
      },
    ];
  } else {
    options = [
      {
        text: "Acknowledge",
        type: "primary",
        action: acknowledge,
      },
    ];
  }

  modalState.append({
    modalType: "options",
    modalContent: {
      type: "warning",
      title: "Your premium is expiring",
      description: `Your premium status, enabling you to access the entirety of the OSINTer interface is set to expire on ${getReadableDate(
        user.premium.expire_time * 1000
      )}. If you believe that this is an error you can [contact support](mailto:${contactEmail})`,
      options,
    },
  });
};

export function spawnActionModal(
  user: User | null,
  remindDateStore: Writable<number>,
  paymentIntentClientSecret: string | null
) {
  if (paymentIntentClientSecret)
    showPaymentResults(paymentIntentClientSecret, user?.username);

  if (!user) return;
  if (
    !user.premium.acknowledged["expiry"] &&
    user.payment.subscription.level.length < 1 &&
    user.premium.status &&
    user.premium.expire_time * 1000 > Date.now() &&
    user.premium.expire_time * 1000 < Date.now() + 1000 * 60 * 60 * 24 * 14
  )
    return spawnPremiumExpirationModal(user);
  if (user.payment.subscription.state === "closed")
    return spawnExpiredModal(user.username);

  if (user.payment.invoice.action_required === false) return;

  // Only show modal if it's more than 5 mins ago that action required was noted,
  // Done to avoid scenario where action has been resolved, but webhook just haven't reached server yet
  if ((user.payment.invoice.last_updated + 5 * 60) * 1000 > Date.now()) return;

  const remindMeTime = get(remindDateStore);
  if (!(Date.now() > remindMeTime)) return;

  if (user.payment.invoice.action_type === "authenticate")
    showAuthModal(user, remindDateStore);
  else if (user.payment.invoice.action_type === "update")
    showUpdateModal(user, remindDateStore);
  else
    throw new Error(
      `Invoice action type "${user.payment.invoice.action_type}" not recognized`
    );
}
