<script lang="ts">
  import Fa from "svelte-fa";

  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

  export let title: string;
  export let description: string;
  export let route: string;
  export let icon: IconDefinition;

  export let index: number;
</script>

<a
  href={route}
  class="
  relative

  mt-4
  sm:mt-8

  p-4
  xl:p-8

  md:mt-12
  md:mb-4
  xl:mt-16
  xl:mb-8

  flex
  flex-col
  items-center
  text-center

  border
  border-surface-300
  dark:border-surface-900

  bg-surface-200
  dark:bg-surface-700

  shadow-sm
  md:shadow-md

  hover:shadow-lg
  dark:hover:scale-105
  hover:bg-surface-100
  dark:hover:bg-surface-600

  transition-all
  duration-300

  [&:hover>div>svg]:opacity-100
"
>
  <div
    class="
    flex justify-center items-center
    w-16 rounded-full aspect-square
    -mt-10 mb-4
    
    md:w-20 md:-mt-14

    xl:w-28
    xl:-mt-20 xl:mb-4

    drop-shadow-lg
    bg-primary-{600 + index * 100}

    text-white
  "
  >
    <Fa {icon} class="text-3xl opacity-80 transition-opacity duration-300" />
  </div>
  <h3 class="font-semibold text-4xl">{title}</h3>
  <p
    class="
    text-sm
    sm:text-base

    font-light

    leading-4
    xl:leading-5
    m-2
    sm:m-0
  "
  >
    {description}
  </p>
</a>
