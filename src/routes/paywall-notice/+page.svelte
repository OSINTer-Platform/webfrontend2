<script lang="ts">
  import type { PageData } from "./$types";

  import { beforeNavigate } from "$app/navigation";
  import { contactEmail } from "$shared/config";

  import Logo from "$lib/assets/fullLogo.png";

  export let data: PageData;

  $: user = data.user;
  $: showPaywallNotice = data.settings.showPaywallNotice;

  beforeNavigate(({ willUnload }) => {
    if (!willUnload) showPaywallNotice.set(false);
  });
</script>

<div
  class="flex flex-col items-center h-full bg-surface-100 dark:bg-surface-900 overflow-y-auto"
>
  <main
    class="
      max-w-4xl p-12 m-4 sm:m-8 lg:m-16
      bg-surface-50 dark:bg-surface-700
      flex flex-col gap-8
    "
  >
    <h1 class="font-bold text-3xl md:text-5xl">
      We are paywalling OSINTer. Here is what that means for you...
    </h1>

    <img
      src={Logo}
      class="w-full h-64 md:h-96 overflow-hidden object-cover"
      alt="OSINTer logo"
    />

    <section>
      <p class="font-bold text-2xl mb-2">TL;DR:</p>
      <ul class="italic list-disc list-inside">
        <li>
          We are paywalling the previously free features of OSINTer in an effort
          to keep the platform sustainable.
        </li>
        <li>The new base price will be 15$/month.</li>
        <li>The source-code continues to be open-source.</li>
        <li>Some teams have chosen to self-host</li>
        <li>
          If you (or your team) is majorly impacted by this change, feel free to
          reach out at <a href="mailto:{contactEmail}" class="link"
            >{contactEmail}</a
          >
        </li>
      </ul>
    </section>

    <section class="flex flex-col gap-4">
      <p class="font-bold text-lg">
        Running a digital platform isn't necessarily hard. But making it
        economically sustainable definitely is.
      </p>
      <p>
        At OSINTer we have had to learn this the hard way. Just building a great
        platform, and saturating it with users (to a degree where we have had to
        scale up our infrastructure multiple times) unfortunately doesn't bring
        in any cash, and while we would love nothing more than just continue to
        develop OSINTer, the matter of the fact is that we not only have to
        cover infrastructure-expenses but developing and maintaining OSINTer is
        also a massive time-sink for us, and living isn't free.
      </p>
      <p>
        As such, we are paywalling all of the functionality present on OSINTer.
        This is going to work by keeping the existing OSINTer Pro plan (with
        access to everything) and introducing a new OSINTer Base plan, which
        will provide access to the previously free functionality. The price of
        this new plan is set at 15$/month.
      </p>
      <p>
        We do realize that when you signed up for OSINTer, this wasn't on the
        roadmap. You probably didn't expect us to suddenly slap a fee on the
        platform you had just gotten used to, and you might even have signed-up
        under the our assurance that the platform would stay free. But as we are
        better developers than salesmen, we have reached a point where the only
        other choice we have left would be to close down the platform, a choice
        we are convinced would cause even more trouble. As such, we apologize
        for giving the impression that the platform would stay free, but stand
        by the statement that this decision is the least problematic option for
        our users.
      </p>

      <p>
        As for the bigger teams (and ambitious individuals) out there using
        OSINTer, self-hosting the platform is always an option - and that's
        promise we are legally bound to (as per the result of the open-source
        license the project is under). While this isn't a process we officially
        support outside of our <a href="/purchase?plan=enterprise" class="link"
          >enterprise deals</a
        >
        it is certainly possible. We currently know of a handful of teams who have
        done this - some with our support through an
        <a href="/purchase?plan=enterprise" class="link">enterprise deal</a>
        and some completely on their own. If you attempt this and have trouble with
        it, feel free to reach out at
        <a href="mailto:{contactEmail}" class="link">{contactEmail}</a>.
      </p>
    </section>

    <nav>
      {#if !$user}
        <a href="/login">Log in</a>
        <a href="/signup">Signup</a>
      {:else if $user.payment.subscription.level.length}
        <a href="/purchase?plan=base">Subscribe</a>
      {/if}
      <a href="mailto:{contactEmail}">Contact us</a>
    </nav>
  </main>
</div>

<style lang="postcss">
  a.link {
    @apply underline transition-colors hover:text-primary-500;
  }

  nav {
    @apply flex flex-col sm:flex-row gap-4;

    a {
      @apply grow font-bold text-xl text-center
      p-4 border border-primary-500 hover:bg-primary-500/20
      active:scale-95 transition-all;
    }
  }
</style>
