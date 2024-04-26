<script lang="ts">
  import Button from "./button.svelte";
  import TimeSlider from "$com/utils/inputs/time/doubleSlider.svelte";

  type Range = {
    id: string;
    title: string;
    days: number;
  };

  export let firstDate: Date | null;
  export let lastDate: Date | null;
  export let selected: string;

  const daySeconds = 24 * 60 * 60 * 1000;

  export let defaultRanges: Range[] = [
    { title: "Last day", id: "day", days: 1 },
    { title: "Last week", id: "week", days: 7 },
    { title: "Last month", id: "month", days: 30 },
    { title: "Last year", id: "year", days: 360 },
  ];
</script>

<aside>
  <section class="flex gap-4 flex-wrap mb-4">
    {#each defaultRanges as { id, title, days } (id)}
      <Button
        selected={selected === id}
        on:click={() => {
          lastDate = null;
          firstDate = new Date(new Date().getTime() - daySeconds * days);
          selected = id;
        }}
      >
        {title}
      </Button>
    {/each}
    <Button
      selected={selected === "all"}
      on:click={() => {
        lastDate = null;
        firstDate = null;
        selected = "all";
      }}
    >
      All time
    </Button>
    <Button
      selected={selected === "custom"}
      on:click={() => {
        selected = "custom";
      }}
    >
      Custom range
    </Button>
  </section>

  {#if selected === "custom"}
    <TimeSlider bind:firstDate bind:lastDate />
  {/if}
</aside>
