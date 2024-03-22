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
    faBullseye,
    faChartLine,
    faClockRotateLeft,
    faPeopleGroup,
    faWrench,
  } from "@fortawesome/free-solid-svg-icons";
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";

  export let stripe: null | Promise<null | Stripe>;
  export let personalPrice: Price;

  const paymentTypes = ["personal", "enterprise"] as const;
  type PaymentType = (typeof paymentTypes)[number];

  let selectedType: PaymentType = "personal";

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
          "Get prioritized bug-reporting along with a SLA, to guarantee that we won't be the bottleneck in your workflow",
        icon: faClockRotateLeft,
      },
      {
        title: "Custom configuration",
        description:
          "We strive to meet our users needs where they are at. Need on-prem deployment for data-protection? Or maybe you have custom configuration requirements just for you team? Contact us, and experience a sea of opportunities",
        icon: faWrench,
      },
    ],
    personal: [
      {
        title: "The big overview",
        description:
          "Get access to our dashboard options, to better track the ever-evolving threat landscape",
        icon: faChartLine,
      },
      {
        title: "In depth research",
        description:
          "Experience our custom machine-learning, cutting out the noise and helping you focus on what is important",
        icon: faBullseye,
      },
      {
        title: "Get a helping hand",
        description:
          "Use our AI offerings to find, condense and summarize information, ensuring you find what you need",
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
  <h1 class="mb-4 sm:mb-10 text-4xl sm:text-6xl font-bold">Try OSINTer PRO</h1>

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
        transition:fade|local
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
    relative mb-8 w-full h-14 sm:h-16 px-2
    bg-white dark:bg-black/25 rounded-xl
    flex flex-col
  "
  >
    <div
      class="
        grow w-1/2 my-2
        rounded-xl bg-primary-500/25
        transition-transform
      "
      style={selectedType === paymentTypes[1]
        ? "transform: translateX(100%);"
        : ""}
    />

    <div
      class="
      absolute w-full h-full
      grid grid-cols-2 items-center
    "
    >
      {#each paymentTypes as paymentType}
        <label
          class="
          h-full flex items-center justify-center
          text-center capitalize font-light
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

  {#if selectedType === "personal"}
    {#if stripe}
      {#await stripe}
        <Loader text="Loading payment components" />
      {:then stripe}
        {#if stripe}
          <Personal {stripe} {personalPrice} />
        {/if}
      {/await}
    {:else}
      <Loader text="Loading payment info" />
    {/if}
  {:else}
    <Enterprise />
  {/if}
</section>
