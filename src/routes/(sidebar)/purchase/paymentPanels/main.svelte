<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
  import type { Stripe } from "@stripe/stripe-js";
  import type { Price } from "$shared/types/stripe";

  import Personal from "./personal/index.svelte";
  import Enterprise from "./enterprise.svelte";
  import Loader from "$com/loader.svelte";
  import Fa from "svelte-fa";

  import { faSearchengin } from "@fortawesome/free-brands-svg-icons";
  import {
    faBug,
    faClockRotateLeft,
    faDashboard,
    faMagnifyingGlass,
    faNewspaper,
    faPeopleGroup,
    faUser,
    faWrench,
  } from "@fortawesome/free-solid-svg-icons";
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";

  export let stripe: null | Promise<null | Stripe>;
  export let basePrice: Price;
  export let proPrice: Price;
  export let plan: string | null;

  type PaymentType = "base" | "pro" | "enterprise";
  const paymentTypes: PaymentType[] = ["base", "pro", "enterprise"] as const;

  const isPayment = (s: string): s is PaymentType =>
    paymentTypes.includes(s as any);

  let selectedType: PaymentType = plan && isPayment(plan) ? plan : "base";

  const perks: {
    [key in PaymentType]: {
      title: string;
      description: string;
      icon: IconDefinition;
    }[];
  } = {
    enterprise: [
      {
        title: "Team-wide PRO access",
        description:
          "Get your whole team access to OSINTer PRO, hazzle-free. No extra seat expenses, usage costs or other hidden fees",
        icon: faPeopleGroup,
      },
      {
        title: "Guarranteed reliability",
        description:
          "Get prioritized bug-reporting and support, guaranteeing we won't be the bottleneck in your workflow",
        icon: faClockRotateLeft,
      },
      {
        title: "Custom configuration",
        description:
          "We strive to meet our users needs where they are at. Need on-prem deployment for data-protection? Or maybe you have custom configuration requirements just for you team? Contact us, and experience a sea of opportunities",
        icon: faWrench,
      },
    ],
    base: [
      {
        title: "Daily news",
        description:
          "Keep up to date on cyber-security and ensure that you are not going to miss any of the big news",
        icon: faNewspaper,
      },
      {
        title: "Deep search",
        description:
          "Get access to a large, historical archive of more than 50.000 news articles and a set of advanced search options",
        icon: faMagnifyingGlass,
      },
      {
        title: "User customization",
        description:
          "Gives you the ability to cut out the noise and focus on the important stuff",
        icon: faUser,
      },
    ],
    pro: [
      {
        title: "Dashboard access",
        description:
          "Keep up to date on the news-cycle and track the ever-evolving threat landscape",
        icon: faDashboard,
      },
      {
        title: "Trending CVE's",
        description:
          "See what CVE's are currently being exploited and researched, and get insights into how they appear in the wild",
        icon: faBug,
      },
      {
        title: "Get a helping hand",
        description:
          "We don't pretend that AI is going to solve all your problems, but it sure does help.",
        icon: faSearchengin,
      },
    ],
  };

  type Testimonial = {
    name: string;
    title: string;
    content: string;
    linkedin: string;
  };

  const testimonials: Testimonial[] = [
    {
      name: "Martin Kofoed",
      title: "Executive Partner, itm8",
      content:
        "OSINTer really reduces my workload and keeps me up to date on the latest trends in cyber security",
      linkedin: "https://www.linkedin.com/in/martin-kofoed-5b5a49111/",
    },
    {
      name: "Sarah Aalborg",
      title: "CISO at Tivoli",
      content:
        "I highly recommend OSINTER to anyone looking to streamline their daily security operations.",
      linkedin: "https://www.linkedin.com/in/sarah-aalborg-bb348a1/",
    },
  ];

  let visibleTestimonial =
    testimonials[Math.floor(Math.random() * testimonials.length)];

  let testimonialSwitchInterval: ReturnType<typeof setInterval>;

  onMount(() => {
    testimonialSwitchInterval = setInterval(() => {
      const currentIndex = testimonials.indexOf(visibleTestimonial);
      if (currentIndex < 0) return;
      const nextIndex = (currentIndex + 1) % testimonials.length;
      visibleTestimonial = testimonials[nextIndex];
    }, 10000);
  });

  onDestroy(() => clearInterval(testimonialSwitchInterval));
</script>

<section class="h-fit my-auto w-full">
  <p class="font-light tracking-wider text-xs sm:text-base">
    Get the overview. Tackle the threats of tomorrow.
  </p>
  <h1 class="mb-4 sm:mb-10 text-4xl sm:text-6xl font-bold capitalize">
    Try OSINTer {selectedType === "base" ? "base" : "pro"}
  </h1>

  <ul class="flex-col gap-8 hidden xl:flex">
    {#each perks[selectedType] as { title, description, icon }}
      <li class="flex gap-8">
        <div class="h-min my-auto p-4 border border-primary-500 rounded-full">
          <Fa {icon} class="text-2xl text-primary-500 drop-shadow-md" />
        </div>
        <div>
          <h3 class="font-bold text-3xl">{title}</h3>
          <p class="font-light text">{description}</p>
        </div>
      </li>
    {/each}
  </ul>

  <p class="text-line my-12 text-lg font-light hidden xl:flex">
    Curious on what our users say?
  </p>

  <section class="absolute-grid hidden xl:grid">
    {#key visibleTestimonial}
      <div
        class="
          w-full rounded-sm flex flex-col gap-2 p-4
          border border-gray-700/75
          items-center text-center
        "
        transition:fade
      >
        <p class="text-xl font-light italic">"{visibleTestimonial.content}"</p>
        <a
          target="_blank"
          rel="noreferrer noopener"
          href={visibleTestimonial.linkedin}
          class="link-underline font-bold block w-fit border-gray-600"
        >
          {visibleTestimonial.name} -
          <span class="font-light">{visibleTestimonial.title}</span>
        </a>
      </div>
    {/key}
  </section>
</section>

<section class="flex flex-col">
  <aside
    class="
    relative mb-8 w-full h-14 sm:h-16
    bg-white dark:bg-black/25 rounded-xl
    flex
  "
  >
    <div
      class="
        absolute h-full w-1/3 p-2
        transition-transform
      "
      style="transform: translateX({paymentTypes.indexOf(selectedType) * 100}%)"
    >
      <div class="w-full h-full rounded-xl bg-primary-500/20" />
    </div>

    <div
      class="
      h-full grow
      grid grid-cols-3 items-center
    "
    >
      {#each paymentTypes as paymentType}
        <label
          class="
          h-full flex items-center justify-center
          text-center capitalize font-bold
          text-sm sm:text-base
          rounded-xl cursor-pointer
        "
        >
          <input
            type="radio"
            value={paymentType}
            bind:group={selectedType}
            class="hidden"
          />
          {paymentType}
        </label>
      {/each}
    </div>
  </aside>

  {#if selectedType === "base" || selectedType === "pro"}
    {#if stripe}
      {#await stripe}
        <Loader text="Loading payment components" />
      {:then stripe}
        {#if stripe}
          <Personal
            {stripe}
            price={selectedType === "base" ? basePrice : proPrice}
          />
        {/if}
      {/await}
    {:else}
      <Loader text="Loading payment info" />
    {/if}
  {:else}
    <Enterprise />
  {/if}
</section>
