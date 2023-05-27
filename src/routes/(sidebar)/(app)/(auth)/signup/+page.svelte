<script lang="ts">
    import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
    import Fa from 'svelte-fa/src/fa.svelte';

    let username: string = '';
    let password: string = '';
    let repeatPassword: string = '';
    let email: string = '';

    let formError: string | null;
    $: {
        if (username.length == 0) {
            formError = 'Please specify username';
        } else if (password.length == 0) {
            formError = 'Please specify a password';
        } else if (password != repeatPassword) {
            formError = "Passwords doesn't match";
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
	grow

	flex
	flex-col

	gap-8
	justify-center
	items-center
"
>
    <header class="dark:text-white self-stretch">
        <h1 class="text-5xl font-semibold">Hi there!</h1>
        <p class="font-light">
            Sign up below to start your own journey into the wonderful world of
            CTI
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

        <div class="input mb-2">
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

        <hr class="text-surface-400/25 border my-6" />

        <div class="input mb-2">
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
				absolute
				right-4
				top-[1.40rem]

				text-lg

				transition-colors
				duration-300

				text-surface-400/50
				hover:text-primary-600/75

				link-underline
			"><Fa icon={faQuestionCircle} class="mb-0.5" /></a
            >
        </div>

        <hr class="text-surface-400/25 border my-6" />

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
            title={formError ?? ''}>Signup</button
        >
    </form>

    <p class="font-light block w-fit mt-4 dark:text-white">
        Already have a user? <a
            href="/login"
            class="link-underline text-primary-600 dark:text-primary-400 w-fit inline-block"
            >Log in here</a
        >
    </p>
</main>
