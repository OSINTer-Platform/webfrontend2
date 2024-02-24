import { browser } from "$app/environment";
import { get, writable, type Updater, type Writable } from "svelte/store";

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
  afterReset: (handler: () => void) => () => void;
  reset: (duration?: number, steps?: number) => void;
  contentDefault: ContentType;
}
export function writableWithDefault<ContentType>(
  contentDefault: ContentType
): WritableWithDefault<ContentType> {
  const internalStore: Writable<ContentType> = writable(contentDefault);
  const afterResetSubs: Array<() => void> = [];

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
    afterResetSubs.forEach((handler) => handler());
  }

  function afterReset(handler: () => void) {
    afterResetSubs.push(handler);
    return () => {
      const i = afterResetSubs.indexOf(handler);
      if (i > -1) afterResetSubs.splice(i, 1);
    };
  }

  return {
    subscribe: internalStore.subscribe,
    set: internalStore.set,
    update: internalStore.update,
    reset,
    afterReset,
    contentDefault,
  };
}

export type CookieOptions = {
  sameSite: string;
  secure: boolean;
  path: string;
  expires: Date;
};

export function cookieStore<T>(
  key: string,
  defaultVal: T,
  options: Partial<CookieOptions> = {}
): Writable<T> {
  const cookieOptions: CookieOptions = {
    sameSite: "strict",
    secure: true,
    path: "/",
    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    ...options,
  };

  // Use encodeURIComponent to encode " as some libraries will remove those when parsing cookies
  const serialize = (content: T): string =>
    encodeURIComponent(JSON.stringify(content));
  const deserialize = (content: string): T =>
    JSON.parse(decodeURIComponent(content));

  function getInitialVal(key: string, defaultVal: T) {
    if (!browser) return defaultVal;

    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${key}=`))
      ?.split("=")[1];

    if (cookie) {
      try {
        return deserialize(cookie);
      } catch {
        return defaultVal;
      }
    } else {
      return defaultVal;
    }
  }

  function setCookie(key: string, value: T) {
    if (!browser) return;

    let cookieString = `${key}=${serialize(
      value
    )}; Expires=${cookieOptions.expires.toString()}; SameSite=${
      cookieOptions.sameSite
    }; Path=${cookieOptions.path}`;
    if (cookieOptions.secure) {
      cookieString += "; Secure";
    }

    document.cookie = cookieString;
  }

  const initialVal = getInitialVal(key, defaultVal);
  const internal = writable(initialVal);

  function set(value: T) {
    internal.set(value);
    setCookie(key, value);
  }

  function update(update_fn: Updater<T>) {
    internal.update((val) => {
      const newVal = update_fn(val);
      setCookie(key, newVal);
      return newVal;
    });
  }

  return {
    subscribe: internal.subscribe,
    set: set,
    update: update,
  };
}
