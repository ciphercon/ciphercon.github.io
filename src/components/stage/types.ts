/** Imperative API every stage scene exposes to the orchestrator. */
export type SceneRef = {
  show: () => Promise<void>;
  hide: () => Promise<void>;
  /** Jump to the hidden state without animating. */
  reset: () => void;
};
