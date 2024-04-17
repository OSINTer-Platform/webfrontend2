<script lang="ts">
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { contactEmail } from "$shared/config";
  import Fa from "svelte-fa";
  import Modal from "../modal.svelte";
  import Button from "./button.svelte";
  import Section from "./section.svelte";
  import { faSpinner } from "@fortawesome/free-solid-svg-icons";
  import { modalState } from "$shared/state/modals";
  import { slide } from "svelte/transition";
  import type { Survey } from "$shared/types/api";

  export let modalId: string;
  export let version: number;

  let counter = 0;

  const sections: {
    title: string;
    rating: number | undefined;
    feedback: string;
  }[] = [
    { title: "Dashboard", rating: undefined, feedback: "" },
    { title: "Overview", rating: undefined, feedback: "" },
    { title: "Topics", rating: undefined, feedback: "" },
    { title: "Assistant (AI)", rating: undefined, feedback: "" },
    { title: "Search", rating: undefined, feedback: "" },
    { title: "Custom feeds/collections", rating: undefined, feedback: "" },
  ];

  let finalFeedback = "";

  let submissionState = Promise.resolve(false);

  async function submit() {
    const surveyContents = sections.map(({ title, rating, feedback }) => ({
      title,
      rating: rating ?? 0,
      feedback,
    }));
    surveyContents.push({
      title: "Final Feedback",
      rating: 0,
      feedback: finalFeedback,
    });

    const survey: Survey = {
      contents: surveyContents,
      version,
    };

    const r = await fetch(`${PUBLIC_API_BASE}/surveys/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(survey),
    });

    if (r.ok) {
      setTimeout(() => modalState.remove(modalId), 2000);
      return true;
    } else throw new Error("Error when submitting survey");
  }
</script>

<Modal
  class="
    p-6
    w-[40rem] max-w-[90vw]
    flex flex-col
    overflow-y-auto

    bg-surface-100 dark:bg-surface-800
  "
  style="max-height: min(90vh, 60rem)"
>
  {#if counter === 0}
    <h1 class="font-bold text-3xl mb-2">Survey:</h1>
    <p class="font-light mb-2 md:text-lg">
      In the following survey we want you to rate how useful different features
      of OSINTer are in your daily work/life. 1 means that the specific feature
      isn't of any use for you at all, while 5 means it's something you use
      every time you access OSINTer.
    </p>
    <p class="font-light md:text-lg">
      There will also be the option to add text for every section, allowing you
      to describe what you think about that feature, suggesting potential
      changes or anything else that comes to mind.
    </p>
    <nav class="w-full flex justify-center gap-1 mt-8">
      <Button primary={false} disabled={true}>Prev</Button>
      <Button primary={true} on:click={() => (counter += 1)}>Next</Button>
    </nav>
  {:else if counter > 0 && counter < 7}
    <main>
      <Section
        title={sections[counter - 1].title}
        bind:selectedRating={sections[counter - 1].rating}
        bind:feedback={sections[counter - 1].feedback}
        on:next={() => (counter += 1)}
        on:prev={() => (counter -= 1)}
      />
    </main>
  {:else if counter === 7}
    <h1 class="font-bold text-3xl mb-2">Thank you!</h1>
    <p class="font-light mb-2">
      Your feedback is always very appreciated, and it allows us to continue to
      deliver the right solutions to your problems. Is there anything else you
      would like to add? It could be things you would like to see improved,
      features you would like to see added or anything else that comes to mind.
      If so, either add them below, or contact us at
      <a
        href="mailto:{contactEmail}"
        target="_blank"
        rel="noopener noreferrer"
        class="underline transition-colors duration-300 hover:text-primary-500"
        >{contactEmail}</a
      >
    </p>

    <section class="mt-4">
      <textarea
        bind:value={finalFeedback}
        placeholder="(Optional feedback)"
        class="
          p-4 w-full h-32 rounded-md
          bg-surface-400/25 outline-none
          border border-surface-400/50
          placeholder-gray-400 dark:placeholder-gray-200/75
        "
      />
    </section>
    {#await submissionState catch e}
      <p class="text-error-500" transition:slide|local>{e.message}</p>
    {/await}

    <nav class="flex justify-center mt-4">
      {#await submissionState}
        <Button
          primary={true}
          disabled={true}
          class="flex justify-center items-center"
        >
          <Fa icon={faSpinner} class="animate-spin text-xl" />
        </Button>
      {:then result}
        <Button
          primary={true}
          disabled={result}
          on:click={() => (submissionState = submit())}
        >
          {result ? "Success!" : "Submit"}
        </Button>
      {:catch}
        <Button primary={true} on:click={() => (submissionState = submit())}>
          Try again
        </Button>
      {/await}
    </nav>
  {/if}
</Modal>
