<script lang="ts">
  import { PUBLIC_API_BASE } from "$env/static/public";
  import type { OpenAIChat, MLAssistantChat } from "$shared/types/api";

  import { onMount } from "svelte";
  import { v4 as uuid } from "uuid";
  import Searchbar from "./searchbar.svelte";

  export let initialPrompt: string;

  let newPrompts: "querying" | "rendering" | "stale" = "querying";
  let promptList: MLAssistantChat = {
    chats: [
      {
        role: "user",
        content: initialPrompt,
        visible: true,
        id: uuid(),
      },
    ],
    article_base: [],
    reached_max: false,
  };
  let dotCounter = 1;
  let followUp: string = "";

  async function updatePromptList(newContent: MLAssistantChat) {
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

    newPrompts = "rendering";

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

        await new Promise((r) => setTimeout(r, 20));
      }
    }

    promptList = newContent;
    newPrompts = "stale";
  }

  async function handleApiResponse(r: Response) {
    if (r.ok) {
      await updatePromptList(await r.json());
    } else {
      promptList.chats = [
        ...promptList.chats,
        {
          role: "assistant",
          content: "An unknown error occurred. Please try again later",
          visible: true,
          id: uuid(),
        },
      ];

      promptList.reached_max = true;

      newPrompts = "stale";
    }
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

    newPrompts = "querying";

    const r = await fetch(`${PUBLIC_API_BASE}/ml/inference/chat/continue`, {
      method: "POST",
      body: JSON.stringify(promptList),

      headers: {
        "Content-Type": "application/json",
      },
    });

    handleApiResponse(r);
  }

  onMount(async () => {
    setInterval(() => {
      dotCounter = (dotCounter % 3) + 1;
    }, 600);

    const r = await fetch(
      `${PUBLIC_API_BASE}/ml/inference/chat/ask` +
        `?question=${encodeURIComponent(initialPrompt)}` +
        `&id=${encodeURIComponent(promptList.chats[0].id)}`
    );

    handleApiResponse(r);
  });
</script>

{#each promptList.chats as { content, visible, id, role } (id)}
  {#if visible}
    <section
      class="
      w-full p-6 mb-6
      rounded-xl
      border-2 border-primary-500

      {role === 'assistant' ? 'dark:text-white' : 'text-xl text-primary-500'}
      leading-6
    "
    >
      {content}
    </section>
  {/if}
{/each}

{#if newPrompts === "querying"}
  <section
    class="
      w-full p-6 mb-6
      rounded-xl
      border-2 border-primary-500

      text-xl dark:text-white
      leading-6
    "
  >
    {".".repeat(dotCounter)}
  </section>
{:else if newPrompts === "stale" && !promptList.reached_max}
  <Searchbar
    on:submit={askFollowUp}
    bind:value={followUp}
    manualActive={true}
    placeholder={"Ask follow-up question"}
  />
{/if}
