<script lang="ts">
  import HeaderShell from "$com/itemList/header/shell.svelte";
  import Loader from "$com/loader.svelte";
  import CVEList from "./cveList.svelte";
  import Timerange from "$com/itemList/header/utils/timerange/index.svelte";
  import ClickableText from "$com/utils/inputs/clickableText.svelte";

  import type { PageData } from "./$types";
  import type { CVEDateField, CVESortBy, SortOrder } from "$shared/types/api";
  import type { RequiredCVESEarchQuery } from "./types";

  import { cveSearch } from "$state/cves";
  import BoxRadios from "$com/utils/inputs/boxRadios.svelte";

  export let data: PageData;

  const timeouts: { [key: string]: ReturnType<typeof setTimeout> } = {};

  $: cves = data.cves;
  $: cveQuery = data.cveQuery;

  function updateDates(
    e: CustomEvent<{ firstDate: Date | null; lastDate: Date | null }>
  ) {
    cveQuery.update(
      (q): RequiredCVESEarchQuery => ({
        ...q,
        first_date: e.detail.firstDate?.toISOString(),
        last_date: e.detail.lastDate?.toISOString(),
      })
    );
  }

  function handleDelayedInput<T>(
    e: any,
    key: keyof RequiredCVESEarchQuery,
    converter: (val: string) => T,
    beforeSuccess: ((newVal: T) => void) | undefined = undefined,
    afterSucess: ((newVal: T) => void) | undefined = undefined
  ) {
    clearTimeout(timeouts[key]);
    timeouts[key] = setTimeout(() => {
      if ($cveQuery[key] != e.target.value) {
        const newVal = converter(e.target.value);
        beforeSuccess?.(newVal);
        // @ts-ignore
        $cveQuery[key] = newVal;
        afterSucess?.(newVal);
      }
    }, 500);
  }

  const dateFields: { text: string; value: CVEDateField }[] = [
    { text: "published", value: "publish_date" },
    { text: "modified", value: "modified_date" },
  ];

  const sortOrders: { text: string; value: SortOrder }[] = [
    { text: "descending", value: "desc" },
    { text: "ascending", value: "asc" },
  ];

  const sortBy: { text: string; value: CVESortBy }[] = [
    { text: "Document count", value: "document_count" },
    { text: "Publish date", value: "publish_date" },
    { text: "Modified date", value: "modified_date" },
    { text: "Search", value: "" },
  ];
</script>

<HeaderShell
  title={"CVEs in OSINTer"}
  description={"CVEs corresponding to different articles from OSINTer. Titles are generated by LLM's, so take them with a grain of salt"}
  searchSubmitable={false}
  showReadFilter={false}
  bind:searchValue={$cveSearch}
  contentType="cves"
  documents={$cves}
>
  <hr class="border-tertiary-600/50 my-4" />

  <h3 class="mb-2 sm:font-bold sm:text-lg">
    Filter CVEs based on
    <ClickableText options={dateFields} bind:selected={$cveQuery.date_field} />
    time
  </h3>

  <Timerange
    name="cve-filter-timeframe"
    firstDate={null}
    lastDate={null}
    selected="all"
    on:change={updateDates}
  />
  <hr class="border-tertiary-600/50 my-4" />

  <h3 class="mb-2 sm:font-bold sm:text-lg">
    Sort CVEs
    <ClickableText options={sortOrders} bind:selected={$cveQuery.sort_order} />
  </h3>

  <section class="flex gap-4 flex-wrap mb-4">
    <BoxRadios
      name="cve-sort"
      options={sortBy}
      bind:selected={$cveQuery.sort_by}
    />
  </section>

  <hr class="border-tertiary-600/50 my-4" />

  <h3 class="mb-4 sm:font-bold sm:text-lg">Search for CVEs</h3>

  <section class="flex flex-wrap gap-4">
    <div class="input min-w-16 grow">
      <input
        id="search_term"
        name="search_term"
        placeholder=" "
        class="input"
        type="text"
        value={$cveQuery.search_term ?? ""}
        on:input={(e) => {
          handleDelayedInput(
            e,
            "search_term",
            (val) => val,
            (val) => {
              if (val.length < 1) $cveQuery.sort_by = "document_count";
            },
            (val) => {
              if (val.length > 1) $cveQuery.sort_by = "";
            }
          );
        }}
      />
      <label for="search_term" class="input">Search Term</label>
    </div>

    <div class="input">
      <input
        id="cve"
        name="cve"
        placeholder=" "
        class="input"
        type="text"
        value={$cveQuery.cves ? $cveQuery.cves.join(" ") : ""}
        on:input={(e) =>
          handleDelayedInput(e, "cves", (val) =>
            val.length > 0 ? val.toUpperCase().split(" ") : undefined
          )}
      />
      <label for="cve" class="input">CVE IDs (space-seperated)</label>
    </div>

    <div class="input">
      <input
        id="min_doc_count"
        name="min_doc_count"
        placeholder=" "
        class="input"
        type="text"
        value={$cveQuery.min_doc_count ?? ""}
        on:input={(e) =>
          handleDelayedInput(e, "min_doc_count", (val) =>
            val.length > 0 ? parseInt(val) : undefined
          )}
      />
      <label for="min_doc_count" class="input">Minimum document count</label>
    </div>

    <div class="input">
      <input
        id="limit"
        name="limit"
        placeholder=" "
        class="input"
        type="text"
        value={$cveQuery.limit}
        on:input={(e) =>
          handleDelayedInput(e, "limit", (val) =>
            val.length > 0 ? parseInt(val) : undefined
          )}
      />
      <label for="min_doc_count" class="input">Limit</label>
    </div>
  </section>

  <hr class="border-tertiary-600/50 my-4" />
</HeaderShell>

{#await $cves}
  <Loader />
{:then cves}
  <CVEList {cves} search={$cveSearch} />
{/await}

<style lang="postcss">
  div.input {
    @apply min-w-16 grow;
  }
</style>
