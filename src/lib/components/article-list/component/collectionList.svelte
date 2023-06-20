<script lang="ts">
  import { updateItem } from "$lib/common/userItems";
  import type { Collection } from "$shared/types/userItems";
  import type { Writable } from "svelte/store";

  export let userCollections: Writable<{ [key: string]: Collection }>;
  export let articleId: string;

  export let btnClass: string = "";
  let classes: string = "";
  export { classes as class };

  const handleCheckbox = async (
    e: (MouseEvent | KeyboardEvent) & {
      currentTarget: EventTarget & HTMLLIElement;
    }
  ) => {
    const collectionId = e.currentTarget.id;
    const collection = $userCollections[collectionId];

    let contents: string[] = collection.ids;
    if (collection.ids.includes(articleId)) {
      contents = contents.filter((v) => v != articleId);
    } else {
      contents.push(articleId);
    }

    const newCollection = await updateItem(
      collectionId,
      contents,
      "collection",
      false
    );

    if (newCollection) {
      userCollections.update((collections) => {
        collections[collectionId] = newCollection;
        return collections;
      });
    }
  };
</script>

<button
  class="
		relative
		[&:focus-within>div]:block
		[&:hover>div]:block
		{btnClass}
	"
>
  <slot />
  <div
    on:mousedown|preventDefault
    class="
		hidden absolute

		bg-surface-100
		dark:bg-surface-800

		rounded-lg

		border-tertiary-500
		border

		shadow-xl
		z-20

		cursor-default
		{classes}
	"
  >
    <ul class="p-2">
      {#each Object.values($userCollections) as collection}
        <li
          id={collection._id}
          class="
						p-2
						w-full min-w-max
						flex items-center

						text-left
						rounded-md

						space-x-2

						cursor-pointer

						hover:bg-primary-500/10
						[&:hover>input]:bg-primary-500/20
						[&:hover>input:checked]:bg-primary-600/75
					"
          on:click={handleCheckbox}
          on:keydown={handleCheckbox}
        >
          <input
            type="checkbox"
            id="collection-{collection._id}"
            checked={collection.ids.includes(articleId)}
            class="
						cursor-pointer
						w-4 h-4 aspect-square

						bg-transparent
						checked:bg-primary-500/50

						rounded-sm

						form-checkbox
					"
          />

          <label
            for="collection-{collection._id}"
            class="
						cursor-pointer
						font-light dark:font-normal
						text-xs md:text-sm
						dark:text-white
					">{collection.name}</label
          >
        </li>
        <hr class="border-surface-500/25 last:hidden my-1" />
      {/each}
    </ul>
  </div>
</button>
