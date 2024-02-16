<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;

  import ListShell from "../listShell.svelte";

  $: user = data.user;

  $: emptyMessage =
    data.currentItem.type == "collection"
      ? {
          title: "This is an empty collection",
          description:
            $user?._id === data.currentItem.owner
              ? "Add articles by going to feeds, hovering over an article/article image and hover over the star"
              : "The owner of this feed haven't any articles to it",
        }
      : {
          title: "This feed is empty",
          description:
            "Try changing paramaters like search terms or date range to include more articles",
        };
</script>

<ListShell articles={data.articles} {emptyMessage} />
