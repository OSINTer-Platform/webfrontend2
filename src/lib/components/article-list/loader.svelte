<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  import Loader from "$com/loader.svelte";

  export let chunksVisible: number;

  function intersect(entries: IntersectionObserverEntry[]) {
    const validEntries = entries.filter(
      (el) => el.target.id === "loaderElement"
    );
    if (validEntries[0]?.isIntersecting) chunksVisible += 1;
  }
  onMount(() => {
    if (!browser) return;
    const observer = new IntersectionObserver(intersect, { root: null });
    observer.observe(document.querySelector("#loaderElement") as Element);
  });
</script>

<Loader
  text="Loading more articles..."
  containerClass="py-12"
  id="loaderElement"
/>
