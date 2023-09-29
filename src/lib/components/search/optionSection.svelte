<script lang="ts">
  import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
  import Fa from "svelte-fa";

  export let title: string;
  export let desc: string;
</script>

<h2
  title={desc}
  class="
	flex
	justify-between
	items-center

	text-lg
	font-light

	border-b-2
	border-tertiary-500/75

	mb-4

	dark:text-white
	dark:font-medium
"
>
  {title}
  <Fa icon={faCircleQuestion} class="text-tertiary-700" />
</h2>

<section class="mb-4">
  <slot />
</section>
