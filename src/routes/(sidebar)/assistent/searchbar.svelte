<script lang="ts">
  import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

  import Fa from "svelte-fa";

  export let value: string = "";
  export let manualActive = false;
  export let placeholder = "Ask a question...";

  let classes: string = "";
  export { classes as class };
  $: active = Boolean(value);
</script>

<form class="w-full flex justify-center items-center {classes}" on:submit>
  <label
    class:active
    class:manual-active={manualActive}
    class="
    cursor-text
    z-10

    flex flex-row
    w-full p-4

    border-2 border-primary-500/50
    bg-surface-100 dark:bg-surface-800

    focus-within:border-primary-500 hover:border-primary-500
    [&:hover>svg]:text-primary-500 [&:focus-within>svg]:text-primary-500

    transition-all duration-300
    rounded-xl
  "
  >
    <input
      type="text"
      {placeholder}
      bind:value
      class="
      p-0 bg-transparent form-input border-none focus:ring-0
      ml-2 grow text-xl
      text-primary-500 placeholder:text-primary-500/75
  "
    />

    <button
      disabled={!active}
      class="
      aspect-square rounded-xl h-10 p-2 ml-2
      transition-all duration-300
      {active ? 'hover:scale-105 bg-primary-500' : 'cursor-not-allowed'}
    "
    >
      <Fa
        icon={faPaperPlane}
        class="
        !h-full w-full
        transition-colors duration-300
        {active ? '' : 'text-surface-400/50'}
      "
      />
    </button>
  </label>
  <div />
</form>

<style lang="postcss">
  form {
    div {
      @apply block absolute rounded-xl w-[150%] h-[300%] bg-primary-500;

      opacity: 0;

      animation-name: pulse-aura;
      animation-iteration-count: infinite;
      animation-duration: 3s;
      animation-delay: 0.1s;
    }

    label {
      @apply relative z-10;
      animation-name: pulse-size;
      animation-iteration-count: infinite;
      animation-duration: 3s;

      transform: scale(0.95);

      &:hover,
      &:focus-within,
      &.active,
      &.manual-active {
        animation: upsize;
        animation-iteration-count: 1;
        animation-duration: 0.75s;
        transform: scale(1);

        & + div {
          animation: none;
          display: none;
        }
      }
    }

    @apply relative;
  }

  @keyframes pulse-aura {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    60% {
      transform: scale(0.5, 0.15);
      opacity: 1;
    }
    100% {
      scale: (1);
      opacity: 0;
    }
  }

  @keyframes pulse-size {
    70% {
      transform: scale(0.95);
    }
    80% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(0.95);
    }
  }

  @keyframes upsize {
    0% {
      transform: scale(0.95);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
