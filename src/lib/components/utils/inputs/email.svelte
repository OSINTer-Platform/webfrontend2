<script lang="ts">
  import { valEmail } from "$lib/common/strings";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let value: string = "";
  export let error: boolean = false;

  export let placeholder: string = "your@email.com";
  export let name: string = "email";

  function valContent(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    const val = e.currentTarget.value;
    if (val.length > 0 && !valEmail(val)) error = true;
    dispatch("error", error);
  }
</script>

<input
  {name}
  {placeholder}
  type="text"
  bind:value
  on:input={() => {
    error = false;
    dispatch("error", error);
  }}
  on:change={valContent}
  on:blur={valContent}
/>
