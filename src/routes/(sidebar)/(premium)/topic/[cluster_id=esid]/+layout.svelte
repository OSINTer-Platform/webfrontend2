<script lang="ts">
  import type { HeaderModOptions } from "$shared/types/internal";
  import type { LayoutData } from "./$types";

  import DetailList from "$com/article-list/header/detailList.svelte";
  import HeaderShell from "$com/article-list/header/shell.svelte";

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
    },
    {
      title: "Close topic",
      icon: faXmark,
      action: () => {
        goto("/topic");
      },
    },
  ];

  $: clusterDetails = {
    Nr: [data.cluster.nr.toString()],
    ID: [data.cluster.id],
    Contains: [`${data.cluster.document_count} articles`],
    Keywords: data.cluster.keywords,
  };
</script>

<HeaderShell
  title={data.cluster.title}
  description={data.cluster.description}
  searchAble={false}
  {modOptions}
  bind:searchValue={$articleSearch}
>
  <p
    class="
    text-xs sm:text-sm
    font-light text-justify
    dark:text-white leading-snug mt-4
  "
  >
    {data.cluster.summary}
  </p>
  <hr class="my-4 border-tertiary-700/50" />

  <DetailList options={clusterDetails} mono={true} />
  <hr class="my-4 border-tertiary-700/50" />
</HeaderShell>

<slot />
