<script lang="ts">
  import { updateUser } from "./common";
  import { page } from "$app/stores";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import SubmitButton from "./submitButton.svelte";

  let signupCode = "";

  let submitState: null | Promise<string> = null;

  $: user = $page.data.user;
  $: premium = !!$user?.premium && $user.premium > 0;
  $: disabled = premium || signupCode.length < 1;
  $: disabledString = premium
    ? "User already has premium access"
    : "Missing code";

  function useSignupCode() {
    if (signupCode.length < 1) return;

    submitState = updateUser(
      `${PUBLIC_API_BASE}/my/user/signup-code`,
      "Successfully applied signup-code",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: signupCode }),
      }
    );
  }
</script>

<form
  class="
  flex gap-4 flex-col
  transition-opacity duration-1000
  pb-6 pr-0 md:pb-0 md:pr-6
"
  class:opacity-40={premium}
  title={premium ? "User already has premium access" : ""}
  on:submit|preventDefault={() => useSignupCode()}
>
  <header>
    <h3 class="text-lg sm:text-xl font-bold">Apply signup-code:</h3>
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

  <div class="grow flex gap-2">
    <div class="input grow">
      <input
        type="text"
        bind:value={signupCode}
        on:input={() => (submitState = null)}
        class="input !m-0"
        placeholder=" "
        id="signup-code"
        disabled={premium}
      />
      <label class="input" for="signup-code">Code</label>
    </div>

    <SubmitButton
      state={submitState}
      {disabled}
      {disabledString}
      submitString="Submit new signup-code"
      extraBtnClass="w-12 sm:w-20"
    />
  </div>
</form>
