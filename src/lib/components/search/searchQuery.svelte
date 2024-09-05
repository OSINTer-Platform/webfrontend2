<script lang="ts">
  import Switch from "$inputs/switch.svelte";
  import OptionSection from "./optionSection.svelte";

  import type {
    ArticleSearchQuery,
    ArticleSortBy,
    SortOrder,
  } from "$shared/types/api";
  import Datetime from "$inputs/datetime.svelte";
  import type { SearchRestrictFields } from "$shared/types/internal";

  const sortBy: Array<{ value: ArticleSortBy; name: string }> = [
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

  export let searchQuery: ArticleSearchQuery;
  export let restrictFields: SearchRestrictFields;

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
        disabled={restrictFields.first_date?.disabled ?? false}
        title={restrictFields.first_date?.text ?? ""}
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
        disabled={restrictFields.last_date?.disabled ?? false}
        title={restrictFields.last_date?.text ?? ""}
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
        disabled={restrictFields.sort_by?.disabled ?? false}
        title={restrictFields.sort_by?.text ?? ""}
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
        disabled={restrictFields.sort_order?.disabled ?? false}
        title={restrictFields.sort_order?.text ?? ""}
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
        disabled={restrictFields.limit?.disabled ?? false}
        title={restrictFields.limit?.text ??
          (limitEnabled ? "" : "Flip switch to enable limit")}
        id="limit"
        name="limit"
        placeholder=" "
        class="input"
        type="number"
        inputmode="numeric"
        min="0"
        readonly={!limitEnabled}
        bind:value={searchQuery.limit}
      />
      <label for="limit" class="input">Limit</label>

      <div class="absolute top-1/2 -translate-y-1/2 right-3">
        <Switch
          disabled={restrictFields.limit?.disabled ?? false}
          title={restrictFields.limit?.text ??
            (limitEnabled
              ? "Disable limit. WARNING: Will load LARGE amounts of data."
              : "Enable limit. Strongly recommended")}
          bind:checked={limitEnabled}
          on:change={limitEnabledChange}
        />
      </div>
    </div>
  </OptionSection>

  <OptionSection
    title="Search Term"
    desc="Uses nearly same syntax as Google Dorks. Flip switch to enable highlighting search matches."
  >
    <div class="input">
      <input
        disabled={restrictFields.search_term?.disabled ?? false}
        title={restrictFields.search_term?.text ?? ""}
        id="search_term"
        name="search_term"
        placeholder=" "
        class="input"
        type="text"
        bind:value={searchQuery.search_term}
      />
      <label for="search_term" class="input">Search Term</label>

      <div class="absolute top-1/2 -translate-y-1/2 right-3">
        <Switch
          title="{restrictFields.search_term?.text ??
            (searchQuery.highlight
              ? 'Disable'
              : 'Enable')} highlighting of search matches"
          bind:checked={searchQuery.highlight}
          name="highlight"
          disabled={restrictFields.highlight?.disabled ?? false}
        />
      </div>
    </div>
  </OptionSection>
</div>
