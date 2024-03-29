<script lang="ts">
  import Switch from "$inputs/switch.svelte";
  import type { ActionData, PageData } from "./$types";

  import { enhance } from "$app/forms";

  export let form: ActionData;
  export let data: PageData;

  let username: string = form?.username ?? "";
  let password: string = "";
  let remember: boolean = form?.remember ?? false;

  let formError: string | null = null;
  $: {
    if (username.length == 0) {
      formError = "Please specify username";
    } else if (password.length == 0) {
      formError = "Please specify a password";
    } else {
      formError = null;
    }
  }

  $: success = form?.success ?? true;
  $: title = success ? "Welcome back!" : "Failure!";
  $: detail =
    form?.detail ??
    data.msg ??
    "Log in down below to continue with your journey into the wonderful world of CTI";
</script>

<header class="self-stretch">
  <h1 class="text-5xl font-semibold">{title}</h1>
  <p class="font-light">{detail}</p>
</header>

<form method="post" class="w-full" use:enhance>
  <div class="input mb-6">
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

  <div class="input mb-3">
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

  <div class="flex justify-between w-full">
    <Switch bind:checked={remember} size="sm" name="remember">
      <span class="font-light text-sm ml-2 flex items-center leading-4"
        >Remember Me</span
      >
    </Switch>

    <a
      href="/recover-password"
      class="link-underline text-primary-600 font-light">Forgot password?</a
    >
  </div>

  <hr class="border-surface-400/25 border mb-6 mt-10" />

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
    title={formError ?? ""}>Login</button
  >
</form>

<p class="font-light block w-fit mt-4">
  Not a user yet? <a
    href="/signup"
    class="link-underline text-primary-600 dark:text-primary-400 w-fit inline-block"
    >Sign up here</a
  >
</p>
