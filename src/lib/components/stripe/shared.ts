import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export type SubmissionState =
  | { state: "success" | "error" | "loading"; msg?: string }
  | undefined;

export type SideButtons =
  | { title: string; icon: IconDefinition; action: () => void }[]
  | undefined;
