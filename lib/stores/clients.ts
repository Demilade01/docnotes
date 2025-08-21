import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useTranscriptions } from "@/lib/stores/transcriptions";

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  email: string;
  userId: string;
};

type State = {
  clients: Client[];
  selectedClientId: string | null;
};

type Actions = {
  setSelectedClient: (clientId: string | null) => void;
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
};

// Mock client data as specified in requirements
const mockClients: Client[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    dob: "1985-03-15",
    phone: "(555) 123-4567",
    email: "sarah.johnson@email.com",
    userId: "SJ001"
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chen",
    dob: "1992-07-22",
    phone: "(555) 234-5678",
    email: "michael.chen@email.com",
    userId: "MC002"
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Rodriguez",
    dob: "1988-11-08",
    phone: "(555) 345-6789",
    email: "emily.rodriguez@email.com",
    userId: "ER003"
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Thompson",
    dob: "1979-05-12",
    phone: "(555) 456-7890",
    email: "david.thompson@email.com",
    userId: "DT004"
  },
  {
    id: "5",
    firstName: "Lisa",
    lastName: "Williams",
    dob: "1995-09-30",
    phone: "(555) 567-8901",
    email: "lisa.williams@email.com",
    userId: "LW005"
  }
];

export const useClients = create<State & Actions>()(
  persist(
    (set, get) => ({
      clients: mockClients,
      selectedClientId: null,
      setSelectedClient: (clientId) => set({ selectedClientId: clientId }),
      addClient: (client) => {
        const newClient = { ...client, id: Date.now().toString() };
        set((state) => ({
          clients: [...state.clients, newClient]
        }));
      },
      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...updates } : client
          )
        }));
      },
      deleteClient: (id) => {
        // Remove client
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id)
        }));
        // Cascade delete notes for this client
        try {
          const deleteByClientId = useTranscriptions.getState().deleteByClientId;
          deleteByClientId(id);
        } catch (_) {}
      },
    }),
    {
      name: "docnotes-clients",
      version: 0,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

