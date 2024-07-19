<script lang="ts">
  import PriceCom from "./price.svelte";

  import type { Price } from "$shared/types/stripe";
  import {
    faBug,
    faDashboard,
    faLink,
    faMagnifyingGlass,
    faPeopleGroup,
    faWrench,
  } from "@fortawesome/free-solid-svg-icons";

  import { faNewspaper, faUser } from "@fortawesome/free-regular-svg-icons";
  import { faSearchengin } from "@fortawesome/free-brands-svg-icons";
  import { page } from "$app/stores";
  import { contactEmail } from "$shared/config";
  import { goto } from "$app/navigation";

  export let personalPrice: Price | undefined;

  $: user = $page.data.user;
  $: hasPro = $user?.payment.subscription.level === "pro";

  const enterpriseMailSubjet = "Interested in OSINTer Enterprise";
  $: enterpriseMailto = `mailto:${contactEmail}?subject=${encodeURI(
    enterpriseMailSubjet
  )}`;
</script>

<ul
  class="
  grid gap-8
  md:grid-cols-2 lg:grid-cols-3
"
>
  <PriceCom
    index={0}
    title="free"
    bulletPoints={[
      {
        icon: faNewspaper,
        text: "**Daily news:** Keep up to date on cyber-security and ensure that you are not going to miss any of the big news",
      },
      {
        icon: faMagnifyingGlass,
        text: "**Deep search:** Get access to a large, historical archive of more than 50.000 news articles and a set of advanced search options",
      },
      {
        icon: faUser,
        text: "**User customization:** Gives you the ability to cut out the noise and focus on the important stuff",
      },
    ]}
    pricePanel={{ price: "Free", bottomText: "Free, forever" }}
  >
    <button disabled={!!$user} on:click={() => goto("/signup")}>
      {$user ? "You are already logged in" : "Signup"}
    </button>
  </PriceCom>
  {#if personalPrice}
    {@const { unit_amount, currency } = personalPrice}
    <PriceCom
      index={1}
      title="pro"
      bulletPoints={[
        {
          icon: faDashboard,
          text: "**Dashboard access:** Keep up to date on the news-cycle and track the ever-evolving threat landscape",
        },
        {
          icon: faBug,
          text: "**Trending CVE's:** See what CVE's are currently being exploited and researched, and get insights into how they appear in the wild",
        },
        {
          icon: faSearchengin,
          text: "**Cutting-edge AI:** We don't pretend that AI is going to solve all your problems, but it sure does help.",
        },
      ]}
      pricePanel={{
        price: { amount: unit_amount / 100, currency: currency, period: "mo" },
        bottomText: "Cancel anytime",
      }}
    >
      <button disabled={hasPro} on:click={() => goto("/purchase")}>
        {hasPro ? "You are already subscribed" : "Subscribe"}
      </button>
    </PriceCom>
  {/if}
  <PriceCom
    index={2}
    title="enterprise"
    bulletPoints={[
      {
        icon: faLink,
        text: "**Service integration:** Access a range of integration options, from API access to Slack integration",
      },
      {
        icon: faPeopleGroup,
        text: "**Team-wide PRO access:** Onboard your whole team in OSINTer. No extra seat expenses, usage costs or other hidden fees",
      },
      {
        icon: faWrench,
        text: "**Custom deployment:** Need on-prem deployment for data-protection? Or maybe a custom solution? Contact us, and experience a sea of opportunities",
      },
    ]}
    pricePanel={{
      price: { amount: 200, currency: "usd", period: "mo" },
      topText: "Starting at",
      bottomText: "Contact us for a qoute",
    }}
  >
    <a href={enterpriseMailto}> Contact us </a>
  </PriceCom>
</ul>

<style lang="postcss">
  ul {
    :global {
      li.price {
        @apply transition-all duration-300 shadow-none;

        a,
        button,
        header {
          @apply transition-all duration-300;
        }
      }
      li.price1 {
        @apply md:scale-105 md:shadow-xl;
      }
      li.price0,
      li.price2 {
        a,
        button,
        header {
          @apply md:saturate-0;
        }
      }
    }
    &:hover {
      :global {
        li.price1:not(:hover) {
          a,
          button,
          header {
            @apply md:saturate-0;
          }
          @apply md:scale-100 md:shadow-none;
        }
      }
    }
    :global {
      li.price {
        a,
        button {
          @apply w-full py-6
          flex justify-center items-center
          font-bold
          border-t border-primary-500/50
          bg-primary-500/20 hover:bg-primary-500/30
          active:scale-95 transition-all;

          &:disabled {
            @apply !saturate-0 cursor-not-allowed active:scale-100;
          }
        }

        &:hover {
          a,
          button,
          header {
            @apply md:saturate-100;
          }
          @apply md:scale-105 md:shadow-xl;
        }
      }
    }
  }
</style>
