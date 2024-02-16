<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { modalState } from "$shared/state/modals";
  import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
  import { ListRenderModes } from "$shared/config";

  import Fa from "svelte-fa";
  import Modal from "../modal.svelte";
  import CredentialChange from "./credentialChange.svelte";
  import ExternalSetting from "./externalSetting.svelte";
  import RenderSetting from "./renderSetting.svelte";
  import SignupCode from "./signupCode.svelte";
  import StatsRender from "./statsRender.svelte";

  export let topModal: boolean;

  $: user = $page.data.user;
  $: listRenderMode = $page.data.settings.listRenderMode;
  $: darkMode = $page.data.settings.darkMode;

  $: {
    if (topModal && !$user) modalState.remove();
  }
</script>

<Modal
  class="
    p-4 sm:p-6 max-h-[90vh]
    w-[70rem] max-w-[90vw]
    flex flex-col
    overflow-y-auto

    rounded-xl
    border border-tertiary-500
    bg-surface-100 dark:bg-surface-800
  "
>
  <h1
    class="
    font-bold dark:text-white
    text-xl sm:text-2xl md:text-3xl lg:text-4xl
    mb-2 md:mb-4 lg:mb-6
  "
  >
    User settings:
  </h1>

  <main
    class="
    flex flex-col
    dark:text-white
  "
  >
    <StatsRender user={$user} />
    <hr class="mt-4 mb-8 border border-surface-400/50" />

    <section class="grid grid-cols-1 md:grid-cols-2">
      <RenderSetting
        setting={{
          title: "Article list render mode",
          description: "Controls how list of articles is rendered",
          serverName: "list_render_mode",
          values: ListRenderModes,
          store: listRenderMode,
        }}
      />
      <RenderSetting
        setting={{
          title: "Light/Dark mode",
          description: "Change color scheme for interface",
          serverName: "dark_mode",
          values: [
            { name: "Dark", value: true },
            { name: "Light", value: false },
          ],
          store: darkMode,
        }}
      />
    </section>

    <hr class="my-8 border border-surface-400/50" />

    <ExternalSetting />

    <hr class="my-8 border border-surface-400/50" />

    <section class="grid grid-cols-1 md:grid-cols-3">
      <CredentialChange credentialType="username" />
      <CredentialChange credentialType="password" />
      <CredentialChange credentialType="email" />
    </section>

    <hr class="my-8 border border-surface-400/50" />

    <section class="grid grid-cols-1 md:grid-cols-2">
      <SignupCode />
      <form
        method="POST"
        action="/logout"
        use:enhance
        class="
          pl-0 pt-6 md:pl-6 md:pt-0
          flex flex-col justify-center
          border-t-2 md:border-t-0 md:border-l-2
          border-surface-400/50
        "
      >
        <button
          title="Logout"
          type="submit"
          class="
            btn rounded-xl h-20 grow
            inline-flex items-center justify-center
            transition-all duration-300
            bg-primary-400/20
        "
        >
          <Fa icon={faRightFromBracket} class="text-2xl text-primary-500" />
        </button>
      </form>
    </section>
  </main>
</Modal>
