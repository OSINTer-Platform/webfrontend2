import { writable, type Writable } from "svelte/store";

export interface Updatable<T> extends Writable<T> {
  autoUpdate: () => void;
}

export async function updatable<T>(
  updateFn: () => Promise<T>
): Promise<Updatable<T>> {
  const initialVal = await updateFn();
  const { subscribe, set, update } = writable(initialVal);

  const autoUpdate = async () => {
    const updateVal = await updateFn();
    set(updateVal);
  };

  return {
    subscribe,
    set,
    update,
    autoUpdate,
  };
}
