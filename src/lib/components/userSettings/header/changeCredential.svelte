<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { modalState } from "$shared/state/modals";
  import { slide } from "svelte/transition";
  import { PUBLIC_API_BASE } from "$env/static/public";

  import SubmitButton from "$com/utils/submitButton.svelte";

  type CredentialKind = "password" | "username";

  export let modalId: string;
  export let data: { credentialType: CredentialKind };

  const needsReload: { [key in CredentialKind]: boolean } = {
    username: true,
    password: false,
  };

  let currentPassword = "";
  let newCredential = "";

  let submitState: null | Promise<string> = null;

  let removeModalTimeout: ReturnType<typeof setTimeout>;

  $: submitAble = currentPassword.length > 0 && newCredential.length > 0;
  $: disabledString = `Missing ${
    currentPassword.length > 0
      ? `new ${data.credentialType}`
      : "current password"
  }`;

  function changeCredential() {
    if (newCredential.length < 1) return;
    clearTimeout(removeModalTimeout);

    const creds = {
      [`new_${data.credentialType}`]: newCredential,
      password: currentPassword,
    };

    submitState = fetch(`${PUBLIC_API_BASE}/my/user/credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creds),
    }).then(async (r) => {
      if (r.ok) {
        if (needsReload[data.credentialType]) invalidateAll();
        removeModalTimeout = setTimeout(() => modalState.remove(modalId), 2000);
        return `Successfully updated ${data.credentialType}`;
      } else if (r.status === 401) invalidateAll();
      const response = await r.json();
      throw response["detail"] ?? "An unknown error occurred";
    });
  }
</script>

<form
  class="
    max-w-[80vw] w-[25rem] p-4 bg-surface-100 dark:bg-surface-800
    flex flex-col gap-4 justify-between
  "
  on:submit|preventDefault={() => changeCredential()}
>
  <header>
    <h3 class="text-lg sm:text-2xl font-bold">Change {data.credentialType}</h3>
    <!-- Needs global transitions to react to both if and await statement -->
    {#if submitState}
      {#await submitState then state}
        <p
          class="mb-2 sm:text-sm text-xs italic text-success-500"
          transition:slide|global
        >
          {state}
        </p>
      {:catch e}
        <p
          class="mb-2 sm:text-sm text-xs italic text-error-500"
          transition:slide|global
        >
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
        on:input={() => {
          submitState = null;
          clearTimeout(removeModalTimeout);
        }}
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
        on:input={() => {
          submitState = null;
          clearTimeout(removeModalTimeout);
        }}
        class="input !m-0"
        placeholder=" "
        id="new-password"
      />
      <label class="input" for="new-password">New {data.credentialType}</label>
    </div>

    <SubmitButton
      state={submitState}
      disabled={!submitAble}
      submitString={`Submit new ${data.credentialType}`}
      {disabledString}
    />
  </div>
</form>
