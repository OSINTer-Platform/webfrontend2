<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

{#each data.articles as article}
	<h1>{article.title}</h1>
{/each}
