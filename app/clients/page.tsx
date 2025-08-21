"use client";

import React from "react";
import { useClients } from "@/lib/stores/clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, User, Calendar, Phone, Mail, Hash, Edit, Trash2 } from "lucide-react";

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

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 p-4 lg:p-6">
        <div className="mb-4 lg:mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Clients</h2>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search clients"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>

          {/* Add Client Button */}
          <Button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 lg:p-6">
        <div className="mb-4 lg:mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Client List</h1>
        </div>

        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <User className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              {searchTerm ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first client'}
            </p>
          </div>
                 ) : (
           <div className="bg-white rounded-lg shadow overflow-hidden">
             {/* Desktop Table */}
             <div className="hidden lg:block overflow-x-auto">
               <table className="w-full">
                 <thead className="bg-gray-50">
                   <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       First Name
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Last Name
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       DOB
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Phone
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Email
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       UserID
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Actions
                     </th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                   {filteredClients.map((client) => (
                     <tr key={client.id} className="hover:bg-gray-50">
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm font-medium text-gray-900">
                           {client.firstName}
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-900">
                           {client.lastName}
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-500">
                           {formatDate(client.dob)}
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-500">
                           {client.phone}
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-500">
                           {client.email}
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-500">
                           {client.userId}
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center space-x-2">
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => setSelectedClient(client.id)}
                             className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800"
                           >
                             <User className="h-4 w-4" />
                           </Button>
                           <Button
                             variant="ghost"
                             size="sm"
                             className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800"
                           >
                             <Edit className="h-4 w-4" />
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
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>

             {/* Mobile Cards */}
             <div className="lg:hidden">
               {filteredClients.map((client) => (
                 <div key={client.id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                   <div className="flex items-center justify-between mb-3">
                     <div>
                       <h3 className="text-sm font-medium text-gray-900">
                         {client.firstName} {client.lastName}
                       </h3>
                       <p className="text-xs text-gray-500">{client.userId}</p>
                     </div>
                     <div className="flex items-center space-x-1">
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => setSelectedClient(client.id)}
                         className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800"
                       >
                         <User className="h-4 w-4" />
                       </Button>
                       <Button
                         variant="ghost"
                         size="sm"
                         className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800"
                       >
                         <Edit className="h-4 w-4" />
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
                   <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                     <div className="flex items-center gap-1">
                       <Calendar className="h-3 w-3" />
                       <span>{formatDate(client.dob)}</span>
                     </div>
                     <div className="flex items-center gap-1">
                       <Phone className="h-3 w-3" />
                       <span>{client.phone}</span>
                     </div>
                     <div className="flex items-center gap-1 col-span-2">
                       <Mail className="h-3 w-3" />
                       <span className="truncate">{client.email}</span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         )}
      </div>
    </div>
  );
}

