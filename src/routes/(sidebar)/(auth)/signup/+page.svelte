<script lang="ts">
  import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
  import { enhance } from "$app/forms";

  import Fa from "svelte-fa";

  import type { ActionData } from "./$types";

  export let form: ActionData;

  let username: string = "";
  let password: string = "";
  let repeatPassword: string = "";
  let email: string = "";
  let signupCode: string = "";

  let formError: string | null = null;
  $: {
    if (username.length == 0) {
      formError = "Please specify username";
    } else if (password.length == 0) {
      formError = "Please specify a password";
    } else if (password != repeatPassword) {
      formError = "Passwords doesn't match";
    } else {
      formError = null;
    }
  }

  $: success = form?.success ?? true;
  $: title = success ? "Hi there!" : "Failure!";
  $: detail =
    form?.detail ??
    "Sign up down below to start with your journey into the wonderful world of CTI";
</script>

<header class="dark:text-white self-stretch">
  <h1 class="text-5xl font-semibold">{title}</h1>
  <p class="font-light">{detail}</p>
</header>

<form method="post" class="w-full" use:enhance>
  <section class="flex flex-col gap-5">
    <div class="input">
      <input
        id="username"
        name="username"
        placeholder=" "
        class="input"
        type="text"
        bind:value={username}
      />
      <label for="username" class="input">Username</label>
    </div>

    <div class="input">
      <input
        id="password"
        name="password"
        placeholder=" "
        class="input"
        type="password"
        bind:value={password}
      />
      <label for="password" class="input">Password</label>
    </div>

    <div class="input">
      <input
        id="repeat-password"
        name="repeat-password"
        placeholder=" "
        class="input"
        type="password"
        bind:value={repeatPassword}
      />
      <label for="repeatPassword" class="input">Repeat Password</label>
    </div>
  </section>

  <hr class="text-surface-400/25 border my-8" />

  <section class="flex flex-col gap-5">
    <div class="input">
      <input
        id="email"
        name="email"
        placeholder=" "
        class="input"
        type="text"
        bind:value={email}
      />
      <label for="email" class="input">Email - (Optional)</label>

      <a
        href="/blog/why-do-we-keep-emails/"
        title="Why do we keep emails?"
        target="_blank"
        rel="noopener noreferrer"
        class="
          absolute right-4 top-1/2 -translate-y-1/2

          text-lg

          transition-colors
          duration-300

          text-surface-400/50
          hover:text-primary-600/75

          link-underline
        "><Fa icon={faQuestionCircle} class="mb-0.5" /></a
      >
    </div>

    <div class="input">
      <input
        id="signupCode"
        name="signupCode"
        placeholder=" "
        class="input"
        type="text"
        bind:value={signupCode}
      />
      <label for="signupCode" class="input">Signup Code - (Optional)</label>
    </div>
  </section>

  <hr class="text-surface-400/25 border mt-8 mb-6" />

  <button
    type="submit"
    class="
			btn
			w-full
			h-16

			border
			border-primary-400

			text-primary-700
			dark:text-primary-400

			text-lg
			font-light

			disabled:border-surface-700/10
			disabled:text-surface-700/50

			dark:disabled:border-surface-400
			dark:disabled:text-surface-300

			disabled:cursor-not-allowed
			disabled:scale-100
		"
    disabled={Boolean(formError)}
    title={formError ?? ""}>Signup</button
  >
</form>

<p class="font-light block w-fit mt-4 dark:text-white">
  Already have a user? <a
    href="/login"
    class="link-underline text-primary-600 dark:text-primary-400 w-fit inline-block"
    >Log in here</a
  >
</p>
