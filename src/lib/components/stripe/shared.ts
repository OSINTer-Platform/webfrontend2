type SubmissionState =
  | { state: "success" | "error" | "loading"; msg?: string }
  | undefined;
