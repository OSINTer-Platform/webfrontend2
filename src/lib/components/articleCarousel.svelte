<script lang="ts">
  import ModalLink from "$com/modalLink.svelte";
  import { getReadableDate } from "$lib/common/math";
  import type { ArticleBase } from "$shared/types/api";
  import { onMount } from "svelte";

  export let similarArticles: ArticleBase[];

  let manual = false;
  let pressed = false;
  let x: number;

  let outerBox: HTMLElement;
  $: outerLeft = outerBox?.getBoundingClientRect()?.x;

  function getX(e: any) {
    if (!e?.type || typeof e.type !== "string") return;

    if (e.type.startsWith("touch")) return e.targetTouches[0].screenX;
    else if (e.type.startsWith("mousemove")) return e.clientX;
  }

  function mousedown(e: any, prevent: boolean = true) {
    if (prevent) e.preventDefault();
    pressed = true;
    manual = true;
    x = getX(e) - outerLeft;
  }

  function mousemove(e: any) {
    if (!pressed) return;
    const localX = getX(e) - outerLeft;
    const scrollBy = (x - localX) * 2;

    e.preventDefault();

    outerBox.scrollBy({ left: scrollBy });
    x = localX;
  }

  function mousestop() {
    pressed = false;
    setTimeout(() => (manual = false), 3000);
  }

  function autoScroll() {
    if (!outerBox) return;

    if (!manual) {
      outerBox.scrollBy({ left: 1 });
    }

    const singleCarouselWidth = outerBox.scrollWidth / 3;

    if (outerBox.scrollLeft < singleCarouselWidth)
      outerBox.scroll({ left: outerBox.scrollLeft + singleCarouselWidth });
    else if (outerBox.scrollLeft > singleCarouselWidth * 2)
      outerBox.scroll({ left: outerBox.scrollLeft - singleCarouselWidth });

    setTimeout(autoScroll, 25);
  }

  onMount(() => {
    autoScroll();
  });
</script>

<section
  role="spinbutton"
  tabindex="0"
  on:mousedown={mousedown}
  on:mousemove={mousemove}
  on:mouseleave={mousestop}
  on:mouseup={mousestop}
  on:touchstart={(e) => mousedown(e, false)}
  on:touchmove={mousemove}
  on:touchcancel={mousestop}
  on:touchend={mousestop}
  bind:this={outerBox}
  id="test"
  class="
  flex gap-4 overflow-x-hidden
  "
>
  {#each [1, 2, 3] as _}
    {#each similarArticles as article}
      <ModalLink
        {article}
        class="shrink-0 h-40 w-52 sm:w-72 sm:aspect-video absolute-grid"
        title={article.description}
        articleList={similarArticles}
      >
        <img
          alt="Article header"
          src={article.image_url}
          class="
        w-full h-full aspect-video object-cover"
        />

        <div class="bg-black/60 dark:bg-black/80" />

        <div class="flex flex-col justify-around px-4">
          <div>
            <p class="font-light text-xs sm:text-sm">
              {article.source}
            </p>
            <h4 class="w-full text-sm sm:text-base font-bold">
              {article.title}
            </h4>
          </div>
          <p class="font-light text-sm text-white">
            {getReadableDate(article.publish_date)}
          </p>
        </div>
      </ModalLink>
    {/each}
  {/each}
</section>
