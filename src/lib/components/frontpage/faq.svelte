<script lang="ts">
  import Fa from "svelte-fa";
  import SvelteMarkdown from "svelte-markdown";

  import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
  import { slide } from "svelte/transition";
  import { contactEmail } from "$shared/config";

  const faq = [
    {
      question: "What is OSINTer",
      answer:
        "In short, OSINTer is a digital platform that aims to help cybersecurity experts - especially those within the field of CTI - with fighting the cybercrime of tomorrow. If you're curious about what this specifically entails, you're always more than welcome to check out [our blog-pages.](/blog/)",
      open: false,
    },
    {
      question: "Is OSINTer open-source?",
      answer:
        "Yes! For a long period OSINTer was without license, but has recently been licensed under Affero GPL v3. This means that you not only can take a peak in the inner-workings of OSINTer at the [public Github repos](https://github.com/OSINTer-Platform), but also that we highly encourage participating in the developemnt of OSINTer.",
      open: true,
    },
    {
      question: "How can I contribute?",
      answer: `As OSINTer is open-source we highly encourage contributions at [the public Github repos](https://github.com/OSINTer-Platform). Outside of that, we regularly do B2B deals and sponsoring is certainly possible too so if in doubt, [please reach out](mailto:${contactEmail}).`,
      open: false,
    },
    {
      question: "I like the project, can I sponsor it?",
      answer: `Absolutely! Running this project has so-far been a completely unpaid journey, but that obviously isn't sustainable and therefore we are actively looking for sponsors. If you're considering it, please consider checking out our [github sponsors](https://github.com/sponsors/OSINTer-Platform) or [reach out on mail](mailto:${contactEmail}).`,
      open: false,
    },
  ];
</script>

<h3
  class="
	mb-6 lg:mb-8
	text-3xl lg:text-3xl
	font-extralight tracking-tight text-center
"
>
  Frequently asked questions
</h3>

{#each faq as { question, answer, open }}
  <button
    type="button"
    on:click={() => {
      open = !open;
    }}
    class="
			w-full py-5
			flex items-center justify-between

			border-b border-surface-400/20

			font-semibold
			text-left text-surface-500 dark:text-white/80
	"
  >
    <h4>{question}</h4>
    <Fa
      icon={faCaretRight}
      class="w-6 h-6 {open ? 'rotate-90' : ''} transition-transform shrink-0"
    />
  </button>

  {#if open}
    <div transition:slide|local>
      <div class="py-5 border-b border-surface-400/20">
        <p class="mb-2 text-gray-500 font-light [&>a]:underline">
          <SvelteMarkdown isInline={true} source={answer} />
        </p>
      </div>
    </div>
  {/if}
{/each}
