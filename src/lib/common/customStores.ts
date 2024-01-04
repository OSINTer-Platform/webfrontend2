import { get, writable, type Writable } from "svelte/store";

export interface ListStore<T> extends Writable<T[]> {
  remove: () => T | undefined;
  append: (el: T) => void;
  prepend: (el: T) => void;
}

export interface Updatable<T> extends Writable<T> {
  autoUpdate: () => void;
}

export function listStore<T>(initialVal: T[]): ListStore<T> {
  const { subscribe, set, update } = writable(initialVal);

  const remove = () => {
    let el: T | undefined;
    update((list) => {
      el = list.pop();
      return list;
    });
    return el;
  };

  const append = (el: T) => update((list) => [...list, el]);
  const prepend = (el: T) => update((list) => [el, ...list]);

  return {
    subscribe,
    set,
    update,
    remove,
    append,
    prepend,
  };
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

export interface WritableWithDefault<ContentType>
  extends Writable<ContentType> {
  reset: (duration?: number, steps?: number) => void;
  contentDefault: ContentType;
}
export function writableWithDefault<ContentType>(
  contentDefault: ContentType
): WritableWithDefault<ContentType> {
  const internalStore: Writable<ContentType> = writable(contentDefault);

  async function taperNumber(duration: number, numberDefault: number) {
    const prevVal = get(internalStore);

    if (typeof prevVal !== "number") {
      throw "Type-mismatch between current content and default content";
    }

    const start = performance.now();
    const stop = start + duration;

    const step = (timeStamp: number) => {
      const elapsed = timeStamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = prevVal + (numberDefault - prevVal) * progress;

      (internalStore as Writable<number>).set(value);

      if (timeStamp < stop) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  async function reset(duration: number = 0) {
    if (duration > 0 && typeof contentDefault === "number") {
      await taperNumber(duration, contentDefault);
    } else {
      internalStore.set(contentDefault);
    }
  }

  return {
    subscribe: internalStore.subscribe,
    set: internalStore.set,
    update: internalStore.update,
    reset,
    contentDefault,
  };
}
