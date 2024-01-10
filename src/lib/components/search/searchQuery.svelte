<script lang="ts">
  import Switch from "$inputs/switch.svelte";
  import OptionSection from "./optionSection.svelte";

  import type { SearchQuery, SortBy, SortOrder } from "$shared/types/api";
  import Datetime from "$inputs/datetime.svelte";
  import { page } from "$app/stores";

  const sortBy: Array<{ value: SortBy; name: string }> = [
    { value: "", name: "Best Match" },
    { value: "publish_date", name: "Publish Date" },
    { value: "read_times", name: "Read Times" },
    { value: "source", name: "Source" },
    { value: "author", name: "Author" },
    { value: "inserted_at", name: "Time of scraping" },
  ];

  const sortOrder: Array<{ value: SortOrder; name: string }> = [
    { value: "desc", name: "Descending" },
    { value: "asc", name: "Ascending" },
  ];

  let limitEnabled = true;

  export let searchQuery: SearchQuery;

  function limitEnabledChange(e: Event) {
    searchQuery.limit = (e.target as HTMLInputElement).checked ? 100 : 0;
  }
</script>

<div class="p-4 h-full overflow-y-auto">
  <OptionSection
    title="Timespan"
    desc="Enter wanted date interval. Only articles published within this interval will be shown."
  >
    <div class="input">
      <Datetime
        id="first_date"
        name="first_date"
        placeholder=" "
        class="input"
        bind:value={searchQuery.first_date}
      />
      <label for="first_date" class="input">First Date</label>
    </div>

    <div class="input">
      <Datetime
        id="last_date"
        name="last_date"
        placeholder=" "
        class="input"
        bind:value={searchQuery.last_date}
      />
      <label for="last_date" class="input">Last Date</label>
    </div>
  </OptionSection>

  <OptionSection
    title="Sorting"
    desc="Choose how to sort articles and whether they should be sorted ascending or descending."
  >
    <div class="input">
      <select
        bind:value={searchQuery.sort_by}
        id="sort_by"
        name="sort_by"
        placeholder=" "
        class="input"
      >
        {#each sortBy as { value, name }}
          <option {value}>{name}</option>
        {/each}
      </select>
      <label for="sort_by" class="input">Sort By</label>
    </div>

    <div class="input">
      <select
        bind:value={searchQuery.sort_order}
        id="sort_order"
        name="sort_order"
        placeholder=" "
        class="input"
      >
        {#each sortOrder as { value, name }}
          <option {value}>{name}</option>
        {/each}
      </select>
      <label for="sort_order" class="input">Sort Order</label>
    </div>
  </OptionSection>

  <OptionSection
    title="Limit"
    desc="Limit number of articles queried from server. Higher number will lead to longer load times."
  >
    <div class="input">
      <input
        id="limit"
        name="limit"
        placeholder=" "
        class="input"
        type="number"
        inputmode="numeric"
        min="0"
        readonly={!limitEnabled}
        bind:value={searchQuery.limit}
        title={limitEnabled ? "" : "Flip switch to enable limit"}
      />
      <label for="limit" class="input">Limit</label>

      <div
        class="absolute top-5 right-3"
        title={limitEnabled
          ? "Disable limit. WARNING: Will load LARGE amounts of data."
          : "Enable limit. Strongly recommended"}
      >
        <Switch bind:checked={limitEnabled} on:change={limitEnabledChange} />
      </div>
    </div>
  </OptionSection>

  {#if $page.data.mlAvailability?.elser}
    <OptionSection
      title="Semantic search"
      desc="Use advanced search to find documents answering your questions"
    >
      <div class="input">
        <input
          id="semantic_search"
          name="semantic_search"
          placeholder=" "
          class="input"
          type="text"
          bind:value={searchQuery.semantic_search}
          on:focus={() => (searchQuery.sort_by = "")}
          on:blur={() =>
            (searchQuery.sort_by = searchQuery.semantic_search
              ? ""
              : "publish_date")}
        />
        <label for="semantic_search" class="input">Ask a question</label>
      </div>
    </OptionSection>
  {/if}
  <OptionSection
    title="Search Term"
    desc="Uses nearly same syntax as Google Dorks. Flip switch to enable highlighting search matches."
  >
    <div class="input">
      <input
        id="search_term"
        name="search_term"
        placeholder=" "
        class="input"
        type="text"
        bind:value={searchQuery.search_term}
      />
      <label for="search_term" class="input">Search Term</label>

      <div
        class="absolute top-5 right-3"
        title="{searchQuery.highlight
          ? 'Disable'
          : 'Enable'} highlighting of search matches"
      >
        <Switch bind:checked={searchQuery.highlight} name="highlight" />
      </div>
    </div>
  </OptionSection>
</div>
