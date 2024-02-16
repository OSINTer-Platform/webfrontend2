<script lang="ts">
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { updateUser } from "./common";
  import SubmitButton from "./submitButton.svelte";

  export let credentialType: "email" | "password" | "username";

  let currentPassword = "";
  let newCredential = "";

  let submitState: null | Promise<string> = null;

  $: submitAble = currentPassword.length > 0 && newCredential.length > 0;
  $: disabledString = `Missing ${
    currentPassword.length > 0 ? `new ${credentialType}` : "current password"
  }`;

  function changeCredential() {
    if (newCredential.length < 1) return;

    const creds = {
      [`new_${credentialType}`]: newCredential,
      password: currentPassword,
    };

    submitState = updateUser(
      `${PUBLIC_API_BASE}/my/user/credentials`,
      `Successfully updated ${credentialType}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(creds),
      }
    );
  }
</script>

<form
  class="
    py-8 first:pt-0 last:pb-0
    md:py-0 md:px-4 md:first:pl-0 md:last:pr-0

    border-surface-400/50 border-t first:border-t-0
    md:border-t-0 md:border-l-2 md:first:border-l-0
    flex flex-col gap-4 justify-between
  "
  on:submit|preventDefault={() => changeCredential()}
>
  <header>
    <h3 class="text-lg sm:text-xl font-bold">Change {credentialType}</h3>
    {#if submitState}
      {#await submitState then state}
        <p class="mb-2 sm:text-sm text-xs italic text-success-500">
          {state}
        </p>
      {:catch e}
        <p class="mb-2 sm:text-sm text-xs italic text-error-500">
          {e}
        </p>
      {/await}
    {/if}
  </header>
  <div
    class="
    flex gap-4 flex-col
  "
  >
    <div class="input min-w-[10rem]">
      <input
        type="text"
        bind:value={currentPassword}
        on:input={() => (submitState = null)}
        class="input !m-0"
        placeholder=" "
        id="current-password"
      />
      <label class="input" for="current-password">Current password</label>
    </div>
    <div class="input min-w-[10rem]">
      <input
        type="text"
        bind:value={newCredential}
        on:input={() => (submitState = null)}
        class="input !m-0"
        placeholder=" "
        id="new-password"
      />
      <label class="input" for="new-password">New {credentialType}</label>
    </div>

    <SubmitButton
      state={submitState}
      disabled={!submitAble}
      submitString={`Submit new ${credentialType}`}
      {disabledString}
    />
  </div>
</form>
