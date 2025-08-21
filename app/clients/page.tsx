"use client";

import React from "react";
import { useClients } from "@/lib/stores/clients";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Phone, Mail, Hash, Plus, Edit, Trash2 } from "lucide-react";
import { useTranscriptions } from "@/lib/stores/transcriptions";
import Link from "next/link";

export default function ClientsPage() {
  const { clients, selectedClientId, setSelectedClient, deleteClient } = useClients();
  const { getClientNotes } = useTranscriptions();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm("Are you sure you want to delete this client? This will also delete all associated notes.")) {
      deleteClient(clientId);
      if (selectedClientId === clientId) {
        setSelectedClient(null);
      }
    }
  };

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
            <p className="mt-2 text-sm text-gray-600">View and manage your client list</p>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Your Clients</h2>
              <p className="text-sm text-gray-600">
                {clients.length} client{clients.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <Link href="/record">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
            </Link>
          </div>

          {clients.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <User className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No clients yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by recording your first session note.
              </p>
              <div className="mt-6">
                <Link href="/record">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((client) => {
                const clientNotes = getClientNotes(client.id);
                const isSelected = selectedClientId === client.id;

                return (
                  <Card
                    key={client.id}
                    className={`relative ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
                  >
                    {isSelected && (
                      <Badge className="absolute top-2 right-2" variant="secondary">
                        Selected
                      </Badge>
                    )}
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {client.firstName} {client.lastName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Hash className="h-4 w-4" />
                        {client.userId}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{formatDate(client.dob)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{client.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="truncate">{client.email}</span>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {clientNotes.length} note{clientNotes.length !== 1 ? 's' : ''}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedClient(client.id)}
                                className="h-8 w-8 p-0"
                              >
                                <User className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClient(client.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

