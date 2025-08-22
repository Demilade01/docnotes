"use client";

import React from "react";
import { useClients } from "@/lib/stores/clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, User, Calendar, Phone, Mail, Hash, Edit, Trash2, Users as UsersIcon, X } from "lucide-react";

export default function ClientsPage() {
  const { clients, selectedClientId, setSelectedClient, deleteClient } = useClients();
  const [searchTerm, setSearchTerm] = React.useState("");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
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

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Client Management</h1>
              <p className="mt-2 text-muted-foreground">Manage your client information and records</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                  <p className="text-2xl font-bold text-foreground">{clients.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                  <p className="text-2xl font-bold text-foreground">{clients.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Selected Client</p>
                  <p className="text-2xl font-bold text-foreground">
                    {selectedClientId ? 'Active' : 'None'}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Hash className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search clients by name, email, phone, or ID..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button variant="outline" className="border-border">
                <Calendar className="h-4 w-4 mr-2" />
                Filter by Date
              </Button>
            </div>
            {searchTerm && (
              <div className="mt-3 text-sm text-muted-foreground">
                Found {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </div>
            )}
          </CardContent>
        </Card>

        {/* Clients List */}
        {filteredClients.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm ? 'No clients found' : 'No clients yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first client'}
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add First Client
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Desktop Table */}
            <Card className="hidden lg:block">
              <CardHeader>
                <CardTitle>Client Directory</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date of Birth
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          User ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-accent/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-primary">
                                  {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-foreground">
                                  {client.firstName} {client.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {client.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-muted-foreground">
                              {formatDate(client.dob)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-muted-foreground">
                              {client.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-muted-foreground font-mono">
                              {client.userId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant={selectedClientId === client.id ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {selectedClientId === client.id ? "Selected" : "Active"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedClient(client.id)}
                                className="h-8 w-8 p-0 text-primary hover:text-primary/80 hover:bg-primary/10"
                                title="Select Client"
                              >
                                <User className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                title="Edit Client"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClient(client.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                title="Delete Client"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredClients.map((client) => (
                <Card key={client.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-primary">
                            {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-foreground">
                            {client.firstName} {client.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{client.userId}</p>
                        </div>
                      </div>
                      <Badge
                        variant={selectedClientId === client.id ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {selectedClientId === client.id ? "Selected" : "Active"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(client.dob)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedClient(client.id)}
                        className="text-primary hover:text-primary/80 hover:bg-primary/10"
                      >
                        <User className="h-4 w-4 mr-1" />
                        Select
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

