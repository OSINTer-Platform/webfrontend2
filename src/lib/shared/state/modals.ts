import { v4 as uuid } from "uuid";
import { listStore, type ListStore } from "$lib/common/customStores";
import type { Modal } from "../types/internal";

type OptionalId<T> = Omit<T, "id"> & { id?: string };

interface AddIdListStore<T> extends Omit<ListStore<T>, "append" | "prepend"> {
  append: (el: OptionalId<T>) => void;
  prepend: (el: OptionalId<T>) => void;
}

function addIdListStore<T extends { id: string }>(
  initialVal: T[]
): AddIdListStore<T> {
  const store = listStore<T>(initialVal);
  const { set, update, subscribe, remove } = store;

  const addId = (el: OptionalId<T>): T => ({ id: uuid(), ...el } as T);

  const append = (el: OptionalId<T>) => store.append(addId(el));
  const prepend = (el: OptionalId<T>) => store.prepend(addId(el));

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
