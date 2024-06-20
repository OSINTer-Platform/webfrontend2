<script lang="ts">
  import ResultPanel from "../resultPanel.svelte";
  import Loader from "$com/loader.svelte";
  import Email from "$com/utils/inputs/email.svelte";
  import Fa from "svelte-fa";

  import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
  import { contactEmail } from "$shared/config";
  import { slide } from "svelte/transition";
  import { PUBLIC_CONTACT_FORM_ENDPOINT } from "$env/static/public";

  $: mailLink = `mailto:${contactEmail}`;

  let sending: null | Promise<boolean> = null;

  let errors: {
    name: string | null;
    email: string | null;
    complete: string | null;
  } = {
    name: null,
    email: null,
    complete: null,
  };

  const valEmail = (s: string) => !!s.match("[^@]+@[^@]+\\.[^@]+");

  async function submitContact(e: Event & { submitter: HTMLElement | null }) {
    function getEmailError(s: string) {
      if (s.length < 1) return "Your email address is incomplete.";
      if (!valEmail(s)) return "Your email address is invalid.";
      return null;
    }

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const name = data.get("name")?.toString();

    errors = {
      name: name && name.length > 0 ? null : "Your name is incomplete.",
      email: getEmailError(data.get("email")?.toString() ?? ""),
      complete: null,
    };

    if (Object.values(errors).some((e) => e !== null)) return;

    sending = fetch(PUBLIC_CONTACT_FORM_ENDPOINT, {
      method: "POST",
      body: data,
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.result == "success") return true;
        else {
          errors = {
            ...errors,
            complete: "Unknown error encountered. Try again",
          };
          return false;
        }
      });
  }
</script>

<div
  class="
  pt-12 pb-8 mb-10
  rounded-xl text-center
  bg-white dark:bg-gray-900
  shadow shadow-gray-400 dark:shadow-black
  "
>
  <p class="font-light text-sm">Starting at</p>

  <h2 class="text-6xl font-bold mb-2">
    $200<span class="text-xl font-light">/mo</span>
  </h2>

  <p class="font-light text-lg">Contact us for a qoute</p>
</div>

<a
  href={mailLink}
  target="_blank"
  rel="noopener noreferrer"
  class="
  py-3 rounded-md
  flex justify-center items-center gap-2
  uppercase font-bold text-xl text-white
  bg-primary-500/40 hover:bg-primary-500/50
  active:scale-95
  transition-all duration-300
  "
>
  <Fa icon={faEnvelope} />
  | mail
</a>

<p class="font-light my-4 text-line">Or let us get in contact with you</p>

{#if !sending}
  <form
    class="flex flex-col gap-4 contact-form"
    on:submit|preventDefault={(e) => submitContact(e)}
  >
    <label class="stripe-input">
      <div class:error={errors.name}>
        <input
          placeholder="Your Name"
          name="name"
          on:input={() => (errors.name = null)}
        />
      </div>

      {#if errors.name}
        <p class="error" transition:slide>{errors.name}</p>
      {/if}
    </label>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="stripe-input">
      <div class:error={errors.email}>
        <Email
          name="email"
          placeholder="Email for contact"
          on:error={(e) =>
            (errors.email = e.detail ? "Your email address is invalid" : null)}
        />
      </div>

      {#if errors.email}
        <p class="error" transition:slide>{errors.email}</p>
      {/if}
    </label>

    <label class="stripe-input">
      <div>
        <textarea
          placeholder="Message (optional)"
          class="h-24"
          name="message"
        />
      </div>
    </label>

    <button
      class="
      w-full py-3 rounded-sm
      shadow shadow-black
      bg-primary-500/40 hover:bg-primary-500/50
      active:scale-95
      transition-all duration-300
    "
    >
      Send
    </button>
  </form>
{:else}
  <div>
    {#await sending}
      <Loader text="Sending details" containerClass="mt-16" />
    {:then response}
      <ResultPanel status={response}>
        {#if response}
          We have successfully recieved your inquiry, and will get back to you
          in 1-3 days
        {:else}
          An unknown error occurred, and we have not recieved your inquiry.
          <button
            on:click={() => (sending = null)}
            class="
              inline-block
              underline hover:text-primary-500
              transition-colors duration-300
            ">Try again,</button
          >
          or use the email option above.
        {/if}
      </ResultPanel>
    {/await}
  </div>
{/if}
