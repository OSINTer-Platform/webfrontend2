<script lang="ts">
  import type { OpenAIChat, MLAssistantChat } from "$shared/types/api";

  import Searchbar from "./searchbar.svelte";

  import { onMount, tick } from "svelte";
  import { v4 as uuid } from "uuid";
  import { handleApiResponse } from "./utils";
  import { PUBLIC_API_BASE } from "$env/static/public";

  export let initialPrompts: MLAssistantChat;

  let promptList: MLAssistantChat = {
    chats: [],
    reached_max: false,
    article_base: [],
  };
  let promptState: "querying" | "rendering" | "stale" = "rendering";
  let dotCounter = 1;
  let followUp: string = "";

  let listContainer: HTMLElement;

  async function renderPromptList(newContent: MLAssistantChat) {
    function truncate_content(chat: OpenAIChat, newLength: number): OpenAIChat {
      const truncated_content = chat.content.slice(0, newLength);

      return {
        role: chat.role,
        content: truncated_content,
        visible: chat.visible,
        id: chat.id,
      };
    }

    const existingIds = promptList.chats.map((chat) => chat.id);

    promptState = "rendering";

    for (const chat of newContent.chats) {
      if (existingIds.includes(chat.id) || !chat.visible) continue;

      promptList.chats.push(truncate_content(chat, 0));

      for (
        let characterCount = 0;
        characterCount < chat.content.length;
        characterCount++
      ) {
        promptList.chats = [
          ...promptList.chats.slice(0, -1),
          truncate_content(chat, characterCount + 1),
        ];

        listContainer.scrollTop = listContainer.scrollHeight;
        await new Promise((r) => setTimeout(r, 20));
      }
    }

    promptList = newContent;
    promptState = "stale";

    await tick();
    listContainer.scrollTop = listContainer.scrollHeight;
  }

  async function askFollowUp() {
    const newChat: OpenAIChat = {
      role: "user",
      content: followUp,
      visible: true,
      id: uuid(),
    };

    followUp = "";

    promptList.chats = [...promptList.chats, newChat];

    promptState = "querying";
    await tick();
    listContainer.scrollTop = listContainer.scrollHeight;

    const r = await fetch(`${PUBLIC_API_BASE}/ml/inference/chat/continue`, {
      method: "POST",
      body: JSON.stringify(promptList),

      headers: {
        "Content-Type": "application/json",
      },
    });

    const newPrompts = await handleApiResponse(r, promptList);
    await renderPromptList(newPrompts);
    promptState = "stale";
  }

  onMount(async () => {
    setInterval(() => {
      dotCounter = (dotCounter % 3) + 1;
    }, 600);

    renderPromptList(initialPrompts);
  });
</script>

<section class="w-full max-w-prose max-h-full mx-auto flex flex-col">
  <ul
    bind:this={listContainer}
    class="
      mb-6
      grow overflow-x-auto
      flex flex-col gap-6
    "
  >
    {#each promptList.chats as { content, visible, id, role } (id)}
      {#if visible}
        <li
          class="
            w-full p-6
            border border-primary-500
            flex flex-col gap-2

            {role === 'assistant'
            ? 'dark:text-white'
            : 'text-xl text-primary-500'}
            leading-6
          "
        >
          {#each content.split("\n") as paragraph}
            <p>{paragraph}</p>
          {/each}
        </li>
      {/if}
    {/each}

    {#if promptState === "querying"}
      <li
        class="
          w-full p-6
          border border-primary-500

          text-xl dark:text-white
          leading-6
        "
      >
        {".".repeat(dotCounter)}
      </li>
    {/if}
  </ul>

  {#if promptState === "stale" && !promptList.reached_max}
    <Searchbar
      on:submit={askFollowUp}
      bind:value={followUp}
      manualActive={true}
      placeholder={"Ask follow-up question"}
    />
  {/if}
</section>
