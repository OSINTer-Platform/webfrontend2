import { browser } from "$app/environment";
import type { ArticleBase, CVEBase } from "$shared/types/api";
import type { Readable } from "svelte/motion";
import {
  derived,
  get,
  writable,
  type Updater,
  type Writable,
} from "svelte/store";
import { sortDocumentsById } from "./sort";

export interface ListStore<T> extends Writable<T[]> {
  remove: () => T | undefined;
  append: (el: T) => void;
  prepend: (el: T) => void;
}

export interface Updatable<R, T = void> extends Writable<Promise<R>> {
  autoUpdate: (arg?: T) => Promise<R>;
}

export interface BackgroundUpdatable<R, T = void> extends Writable<R> {
  autoUpdate: (arg?: T) => Promise<R>;
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

export function updatable<T, R>(
  updateFn: (arg?: T) => Promise<R>,
  initialArg?: T
): Updatable<R, T> {
  const initialVal = updateFn(initialArg);
  const { subscribe, set, update } = writable(initialVal);

  const autoUpdate = (arg?: T) => {
    const updatePromise = updateFn(arg);
    set(updatePromise);
    return updatePromise;
  };

  return {
    subscribe,
    set,
    update,
    autoUpdate,
  };
}

export async function backgroundUpdatable<T, R>(
  updateFn: (arg?: T) => Promise<R>,
  initialArg?: T
): Promise<BackgroundUpdatable<R, T>> {
  const initialVal = await updateFn(initialArg);
  const { subscribe, set, update } = writable(initialVal);

  const autoUpdate = async (arg?: T) => {
    const updateVal = await updateFn(arg);
    set(updateVal);
    return updateVal;
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

export function documentCache<DocumentType extends ArticleBase | CVEBase>(
  searchFn: (ids: string[], sort: boolean) => Promise<DocumentType[]>,
  ids: Readable<string[]>
): Readable<Promise<DocumentType[]>> {
  return derived(
    ids,
    ($ids, _, update) => {
      update(async (existingDocsPromise) => {
        const existingDocs = await existingDocsPromise;
        const filteredDocs = existingDocs.filter((doc) =>
          $ids.includes(doc.id)
        );

        const docIds = filteredDocs.map((doc) => doc.id);

        const newIds = $ids.filter((id) => !docIds.includes(id));
        const newDocs = newIds.length > 0 ? await searchFn(newIds, false) : [];

        return sortDocumentsById(
          $ids,
          [...newDocs, ...filteredDocs],
          (doc) => doc.id
        );
      });
    },
    Promise.resolve([] as DocumentType[])
  );
}

