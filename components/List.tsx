"use client";

import React from "react";
import { useTranscriptions } from "@/lib/stores/transcriptions";
import { useClients } from "@/lib/stores/clients";
import NoteEditor from "@/components/NoteEditor";
import { Button } from "@/components/ui/button";
import { Trash2, User, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function List() {
  const { items, delete: deleteItem, getClientNotes } = useTranscriptions();
  const { clients, selectedClientId } = useClients();
  const [filterClientId, setFilterClientId] = React.useState<string>("all");

  // Filter notes based on selected client
  const filteredItems = React.useMemo(() => {
    if (filterClientId === "all") {
      return items;
    }
    return items.filter(item => item.clientId === filterClientId);
  }, [items, filterClientId]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteItem(id);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <User className="h-12 w-12" />
        </div>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No notes yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start by selecting a client and recording your first session note.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by client:</span>
          </div>
          <Select value={filterClientId} onValueChange={setFilterClientId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All clients</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.firstName} {client.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-500">
          {filteredItems.length} note{filteredItems.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="relative">
            <NoteEditor item={item} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && items.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No notes found for the selected client.</p>
        </div>
      )}
    </div>
  );
}
