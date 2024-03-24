import { v4 as uuid } from "uuid";
import { listStore, type ListStore } from "$lib/common/customStores";
import type { Modal } from "../types/internal";

type OptionalId<T> = Omit<T, "id"> & { id?: string };

interface AddIdListStore<T> extends Omit<ListStore<T>, "append" | "prepend"> {
  append: (el: OptionalId<T>) => void;
  prepend: (el: OptionalId<T>) => void;
  remove: (id?: string) => T | undefined;
}

function addIdListStore<T extends { id: string }>(
  initialVal: T[]
): AddIdListStore<T> {
  const store = listStore<T>(initialVal);
  const { set, update, subscribe } = store;

  const addId = (el: OptionalId<T>): T => ({ id: uuid(), ...el } as T);

  const append = (el: OptionalId<T>) => store.append(addId(el));
  const prepend = (el: OptionalId<T>) => store.prepend(addId(el));

  function remove(id?: string) {
    if (!id) return store.remove();

    let el: T | undefined;
    update((list) => {
      const i = list.findIndex((el) => el.id == id);
      el = list[i];
      list.splice(i, 1);
      return list;
    });
    return el;
  }

  return {
    set,
    update,
    subscribe,
    remove,
    append,
    prepend,
  };
}

export const modalState = addIdListStore<Modal>([]);
