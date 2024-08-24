<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { modalState } from "$shared/state/modals";
  import { PUBLIC_API_BASE } from "$env/static/public";

  import SubmitButton from "$com/utils/submitButton.svelte";
  import { slide } from "svelte/transition";
  import { page } from "$app/stores";

  // svelte-ignore unused-export-let
  export let data: null;
  export let modalId: string;

  let signupCode = "";

  let submitState: null | Promise<string> = null;

  $: disabled = signupCode.length < 1;
  $: disabledString = "Missing code";

  function useSignupCode() {
    if (signupCode.length < 1) return;

    submitState = fetch(`${PUBLIC_API_BASE}/my/user/signup-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: signupCode }),
    }).then(async (r) => {
      if (r.ok) {
        invalidateAll();
        setTimeout(() => modalState.remove(modalId), 2000);
        return "Successfully applied signup-code";
      } else if (r.status === 401) invalidateAll();
      const response = await r.json();
      throw response["detail"] ?? "An unknown error occurred";
    });
  }

  $: user = $page.data.user;
  $: $user?.premium.status ? modalState.remove(modalId) : null;
</script>

<form
  class="
  bg-surface-100 dark:bg-surface-800
  max-w-[80vw] w-[30rem] p-4 flex gap-4 flex-col
  transition-opacity duration-1000
"
  on:submit|preventDefault={() => useSignupCode()}
>
  <header>
    <h3 class="text-lg sm:text-xl font-bold">Submit signup-code:</h3>
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

  <div class="shrink grow flex gap-2">
    <div class="input grow">
      <input
        type="text"
        bind:value={signupCode}
        on:input={() => (submitState = null)}
        class="input !m-0"
        placeholder=" "
        id="signup-code"
      />
      <label class="input" for="signup-code">Code</label>
    </div>

    <SubmitButton
      state={submitState}
      {disabled}
      {disabledString}
      submitString="Submit new signup-code"
      extraBtnClass="w-12 sm:w-24"
    />
  </div>
</form>
