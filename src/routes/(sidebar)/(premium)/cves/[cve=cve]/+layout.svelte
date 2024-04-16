<script lang="ts">
  import type { HeaderModOptions } from "$shared/types/internal";
  import type { LayoutData } from "./$types";

  import DetailList from "$com/itemList/header/detailList.svelte";
  import HeaderShell from "$com/itemList/header/shell.svelte";

  import {
    faCaretDown,
    faCaretUp,
    faDownload,
    faXmark,
  } from "@fortawesome/free-solid-svg-icons";
  import { goto } from "$app/navigation";
  import { articleSearch, showCVEDetails } from "$state/cves";
  import { createItem } from "$lib/common/userItems";
  import { faStar } from "@fortawesome/free-regular-svg-icons";
  import { processCvss2, processCvss3 } from "./cvss";
  import { slide } from "svelte/transition";
  import { PUBLIC_API_BASE } from "$env/static/public";

  export let data: LayoutData;
  $: user = data.user;

  let modOptions: Array<HeaderModOptions>;

  $: modOptions = [
    {
      title: `${$showCVEDetails ? "Hide" : "Show"} CVE details`,
      icon: $showCVEDetails ? faCaretUp : faCaretDown,
      action: () => showCVEDetails.set(!$showCVEDetails),
    },
    ...($user
      ? [
          {
            title: "Convert to collection",
            icon: faStar,
            action: () => {
              createItem(
                data.cve.title,
                data.cve.documents,
                "collection",
                "current"
              );
            },
          },
        ]
      : []),
    {
      title: "Download MD files",
      icon: faDownload,
      route:
        PUBLIC_API_BASE +
        "/cves/" +
        encodeURIComponent(data.cve.id) +
        "/export",
      options: {
        download: "true",
      },
    },
    {
      title: "Close CVE",
      icon: faXmark,
      action: () => {
        goto("/topic");
      },
    },
  ];

  $: baseScore =
    data.cve.cvss3?.cvss_data.base_score ??
    data.cve.cvss2?.cvss_data.base_score;

  $: cveDetails = [
    [
      {
        title: "BaseScore",
        content: baseScore?.toString() ?? "Unknown",
        mono: false,
      },
      {
        title: "Contains",
        content: [`${data.cve.document_count} articles`],
        mono: false,
      },
      { title: "CVE", content: [data.cve.cve], mono: false },
      { title: "Weaknesses", content: data.cve.weaknesses, mono: false },
      {
        title: "Dates",
        content: [
          `Published: ${data.cve.publish_date}`,
          `Modified: ${data.cve.modified_date}`,
        ],
        mono: false,
      },
    ],
  ];

  $: cvss3Details = data.cve.cvss3 ? processCvss3(data.cve.cvss3) : undefined;
  $: cvss2Details = data.cve.cvss2 ? processCvss2(data.cve.cvss2) : undefined;
</script>

<HeaderShell
  title={data.cve.title}
  searchSubmitable={false}
  {modOptions}
  bind:searchValue={$articleSearch}
>
  <p
    class="
    text-xs sm:text-base
    font-light text-justify
    leading-snug
  "
  >
    {data.cve.description}
  </p>

  <DetailList detailBatches={cveDetails} />

  {#if $showCVEDetails}
    <section transition:slide>
      <section
        class="
          {!cvss2Details && !cvss3Details ? 'hidden' : 'grid'}
          {cvss2Details && cvss3Details ? 'md:grid-cols-2' : ''} mt-6"
      >
        {#if cvss3Details}
          <div class="md:mr-4">
            <h3 class="text-2xl font-bold">CVSS 3:</h3>
            <DetailList detailBatches={cvss3Details} />
          </div>
        {/if}

        {#if cvss2Details}
          <div class="md:ml-4">
            <h3 class="text-2xl font-bold">CVSS 2:</h3>
            <DetailList detailBatches={cvss2Details} />
          </div>
        {/if}
      </section>

      <section>
        <h3 class="text-2xl font-bold mb-4">References:</h3>
        <div class="flex flex-wrap gap-2">
          {#each data.cve.references as { url, source, tags }}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={url}
              class="
              p-2 block w-max grow rounded-md
              bg-primary-500/20 transition-colors
              hover:bg-primary-400/60 hover:dark:bg-primary-700/75
              border border-primary-600
            "
            >
              <p class="text-sm sm:text-base">{tags.join(" | ")}</p>
              <p class={tags.length > 0 ? "text-xs" : ""}>{source}</p>
            </a>
          {/each}
        </div>
      </section>
      <hr class="my-4 border-tertiary-700/50" />
    </section>
  {/if}
</HeaderShell>

<slot />
