import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Item = {
  id: string;
  filename: string;
  dateTime: string;
  transcription: string;
  clientId: string | null;
  isEdited: boolean;
  editedTranscription?: string;
};

// Persisted state for version 0 (before edit fields existed)
type PersistedTranscriptionsV0 = {
  items?: Array<{
    id: string;
    filename: string;
    dateTime: string;
    transcription: string;
    clientId: string | null;
  }>;
  count?: number;
};

type State = {
  items: Item[];
  count: number;
};

type Actions = {
  add: (newItem: Pick<Item, "id" | "filename" | "transcription" | "clientId">) => void;
  delete: (id: string) => void;
  deleteByClientId: (clientId: string) => void;
  updateTranscription: (id: string, transcription: string) => void;
  setEditedTranscription: (id: string, editedTranscription: string) => void;
  saveEdit: (id: string) => void;
  cancelEdit: (id: string) => void;
  getClientNotes: (clientId: string) => Item[];
};

export const useTranscriptions = create<State & Actions>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      add: (newItem) => {
        const itemToInsert: Item = {
          ...newItem,
          dateTime: new Date().toLocaleString(),
          isEdited: false,
        } as Item;
        set((state) => ({
          items: [itemToInsert, ...state.items],
          count: state.count + 1,
        }));
      },
      delete: (id) => {
        let _items = get().items;
        _items = _items.filter((item) => item.id !== id);
        const _count = _items.length;
        set({ items: _items, count: _count });
      },
      deleteByClientId: (clientId) => {
        let _items = get().items;
        _items = _items.filter((item) => item.clientId !== clientId);
        const _count = _items.length;
        set({ items: _items, count: _count });
      },
      updateTranscription: (id, transcription) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, transcription } : item
          )
        }));
      },
      setEditedTranscription: (id, editedTranscription) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, editedTranscription, isEdited: true } : item
          )
        }));
      },
      saveEdit: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.editedTranscription
              ? {
                  ...item,
                  transcription: item.editedTranscription,
                  isEdited: false,
                  editedTranscription: undefined
                }
              : item
          )
        }));
      },
      cancelEdit: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  isEdited: false,
                  editedTranscription: undefined
                }
              : item
          )
        }));
      },
      getClientNotes: (clientId) => {
        return get().items.filter((item) => item.clientId === clientId);
      },
    }),
    {
      name: "whisper-transcriptions",
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          const v0 = persistedState as PersistedTranscriptionsV0;
          const migratedItems = (v0.items ?? []).map((item) => ({
            ...item,
            isEdited: false,
          }));
          const migratedCount = typeof v0.count === "number" ? v0.count : migratedItems.length;
          const migratedState: State = {
            items: migratedItems,
            count: migratedCount,
          };
          return migratedState;
        }
        return persistedState as unknown as State;
      },
      storage: createJSONStorage(() => localStorage),
    }
  )
);
