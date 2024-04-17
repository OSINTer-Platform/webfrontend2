import { PUBLIC_API_BASE } from "$env/static/public";
import { modalState } from "$state/modals";

export function spawnSurveyRequest(version: number) {
  async function sendEmptySurvey() {
    fetch(`${PUBLIC_API_BASE}/surveys/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: [], version }),
    });
  }
  modalState.append({
    modalType: "options",
    modalContent: {
      type: "error",
      title: "We are phasing out beta-access!",
      description:
        "Over the next few months we will be phasing out the beta access to a couple of the OSINTer services. Do however not worry. By answering a simple, 6 question survey on how you use OSINTer, you not only get to keep your beta-access until the start of August, but also helps us build the best platform possible. It only takes our users 31 seconds on average to fill in, so it shouldn't be any match for you, right?",
      options: [
        {
          text: "Answer survey",
          type: "primary",
          action: () => {
            modalState.remove();
            modalState.append({
              modalType: "survey",
              modalContent: { version },
            });
          },
        },
        {
          text: "Don't answer",
          type: "secondary",
          action: async () => {
            modalState.remove();
            await sendEmptySurvey();
          },
        },
      ],
    },
  });
}
