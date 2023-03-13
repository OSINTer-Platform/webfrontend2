<script lang="ts">
    import Switch from '$utils/switch.svelte';

    let username: string = '';
    let password: string = '';
    let remember: boolean = false;

    let formError: string | null;
    $: {
        if (username.length == 0) {
            formError = 'Please specify username';
        } else if (password.length == 0) {
            formError = 'Please specify a password';
        } else {
            formError = null;
        }
    }
</script>

<main
    class="
	max-w-md
	lg:max-w-lg

	p-8

	mx-auto

	flex
	flex-col

	gap-8
	justify-center
	items-center
"
>
    <header>
        <h1 class="text-5xl font-semibold">Welcome back!</h1>
        <p class="font-light">
            Log in down below to continue with your journey into the wonderful
            world of CTI
        </p>
    </header>

    <form method="post" class="w-full">
        <div class="input mb-2">
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

        <div class="input mb-2">
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
                <span
                    class="font-light text-sm ml-2 flex items-center leading-4"
                    >Remember Me</span
                >
            </Switch>

            <a
                href="/recover-password"
                class="link-underline text-primary-600 font-light"
                >Forgot password?</a
            >
        </div>

        <hr class="text-surface-400/25 border mb-6 mt-10" />

        <button
            type="submit"
            class="
			btn
			w-full
			h-16

			border
			border-primary-400

			text-primary-700
			text-lg
			font-light

			disabled:border-surface-700/10
			disabled:text-surface-700/50
			disabled:cursor-not-allowed
			disabled:scale-100
		"
            disabled={Boolean(formError)}
            title={formError ?? ''}>Login</button
        >
    </form>

    <p class="font-light block w-fit mt-4">
        Not a user yet? <a
            href="/signup"
            class="link-underline text-primary-600 w-fit inline-block"
            >Sign up here</a
        >
    </p>
</main>
