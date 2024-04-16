<script lang="ts">
  import type { HeaderModOptions } from "$shared/types/internal";
  import type { LayoutData } from "./$types";

  import DetailList from "$com/itemList/header/detailList.svelte";
  import HeaderShell from "$com/itemList/header/shell.svelte";

  import { faDownload, faXmark } from "@fortawesome/free-solid-svg-icons";
  import { goto } from "$app/navigation";
  import { articleSearch } from "$state/topics";
  import { createItem } from "$lib/common/userItems";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { faStar } from "@fortawesome/free-regular-svg-icons";

  export let data: LayoutData;
  $: user = data.user;

  let modOptions: Array<HeaderModOptions>;

  $: modOptions = [
    ...($user
      ? [
          {
            title: "Convert to collection",
            icon: faStar,
            action: () => {
              createItem(
                data.cluster.title,
                data.cluster.documents,
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
      route: `${PUBLIC_API_BASE}/ml/cluster/${encodeURIComponent(
        data.cluster.id
      )}/export`,
      options: {
        download: "true",
      },
    },
    {
      title: "Close topic",
      icon: faXmark,
      action: () => {
        goto("/topic");
      },
    },
  ];

  $: clusterDetails = [
    [
      { title: "Nr", content: [data.cluster.nr.toString()], mono: false },
      { title: "ID", content: [data.cluster.id], mono: false },
      {
        title: "Contains",
        content: [`${data.cluster.document_count} articles`],
        mono: false,
      },
      { title: "Keywords", content: data.cluster.keywords, mono: false },
    ],
  ];
</script>

<HeaderShell
  title={data.cluster.title}
  description={data.cluster.description}
  searchSubmitable={false}
  {modOptions}
  bind:searchValue={$articleSearch}
>
  <p
    class="
    text-xs sm:text-sm
    font-light text-justify
    leading-snug mt-4
  "
  >
    {data.cluster.summary}
  </p>
  <DetailList detailBatches={clusterDetails} />
</HeaderShell>

<slot />
