<script lang="ts">
  import d3Cloud from "d3-cloud";
  import * as d3 from "d3";

  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  import type { CloudWord, PlacedCloudWord } from "./common";

  export let words: CloudWord[];
  export let containerClass = "";

  export let options: {
    range?: [number, number];
    fontFamily?: "sans" | "sans-serif";
    padding?: number;
    size?: number;
    getSize?: (w: number, h: number, scale: [number, number]) => number;
    getColor?: (size: number, text: string) => string;
  } = {};

  let width: number = 0;
  let height: number = 0;
  let mounted = false;

  let placedWords: PlacedCloudWord[] = [];

  let sizeRange: [number, number];
  $: sizeRange = options.range ?? [1, 50];
  $: sizeExtent = d3.extent(words.map(({ size }) => size)) as [number, number];
  $: sizeScale = d3.scaleLinear(sizeExtent, sizeRange);

  $: sizeMultiplier =
    options.getSize?.(width, height, sizeRange) ?? options.size ?? 10;

  $: processedWords = words.map(({ text, size, action, href }) => ({
    size: sizeScale(size),
    text,
    action,
    href,
  }));

  const colorFactory = (sizeRange: [number, number]) =>
    d3.scaleLog(sizeRange, ["#680B1D", "#CC2936"]);

  $: getColor = options.getColor ?? colorFactory(sizeRange);

  const updatePlaced = (
    cloud: ReturnType<typeof d3Cloud>,
    mounted: boolean,
    width: number,
    height: number
  ) => {
    if (mounted) {
      placedWords = [];
      cloud.stop();
      cloud.size([width, height]).words(processedWords.map((w) => ({ ...w })));
      cloud.start();
    }
  };

  $: cloud = d3Cloud()
    .rotate(0)
    .spiral("archimedean")
    .padding(options.padding ?? 2)
    .random(() => 0.5)
    .fontSize((d) => Math.sqrt(d.size ?? 0) * sizeMultiplier)
    .font(options.fontFamily ?? "sans-serif")
    .on("word", (w: PlacedCloudWord) => {
      placedWords = [
        ...placedWords,
        {
          size: w.size,
          x: w.x,
          y: w.y,
          rotate: w.rotate,
          text: w.text,
          action: w.action,
          href: w.href,
        },
      ];
    });

  $: updatePlaced(cloud, mounted, width, height);

  onMount(() => {
    if (!browser) return;
    mounted = true;
  });
</script>

<div bind:clientWidth={width} bind:clientHeight={height} class={containerClass}>
  <svg {width} {height} text-anchor="middle">
    <g>
      {#each placedWords as word}
        <a
          href={word.href ?? "#"}
          on:click={(e) => {
            if (word.action) {
              e.preventDefault;
              word.action(word);
            }
          }}
        >
          <text
            style="font-family: {options.fontFamily ?? 'sans-serif'};"
            font-size={word.size}
            transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
            fill={getColor(word.size, word.text)}>{word.text}</text
          >
        </a>
      {/each}
    </g>
  </svg>
</div>
