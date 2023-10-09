import type { MLAssistantChat } from "$shared/types/api";
import { v4 as uuid } from "uuid";

export async function handleApiResponse(
  r: Response,
  previous_chats: MLAssistantChat | null = null
): Promise<MLAssistantChat> {
  if (r.ok) {
    return await r.json();
  } else {
    if (!previous_chats) {
      return {
        chats: [
          {
            role: "assistant",
            content: "An unknown error occurred. Please try again later",
            visible: true,
            id: uuid(),
          },
        ],
        reached_max: true,
        article_base: [],
      };
    }

    previous_chats.chats.push({
      role: "assistant",
      content: "An unknown error occurred. Please try again later",
      visible: true,
      id: uuid(),
    });

    previous_chats.reached_max = true;
    return previous_chats;
  }
}
