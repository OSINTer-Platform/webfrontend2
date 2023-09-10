<script lang="ts">
  import { navItems } from "$shared/nav";
  import InternalLink from "./internalLink.svelte";
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {#each [...navItems.lists, navItems.ml[0]] as { title, description, route, icon }, index}
    <InternalLink {title} {description} {route} {icon} {index} />
  {/each}
</div>
