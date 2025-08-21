"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, User, Calendar } from "lucide-react";
import { useTranscriptions } from "@/lib/stores/transcriptions";
import { useClients } from "@/lib/stores/clients";

interface NoteEditorProps {
  item: {
    id: string;
    filename: string;
    dateTime: string;
    transcription: string;
    clientId: string | null;
    isEdited: boolean;
    editedTranscription?: string;
  };
}

export default function NoteEditor({ item }: NoteEditorProps) {
  const { setEditedTranscription, saveEdit, cancelEdit } = useTranscriptions();
  const { clients } = useClients();

  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(item.transcription);

  const client = item.clientId ? clients.find(c => c.id === item.clientId) : null;

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(item.transcription);
  };

  const handleSave = () => {
    setEditedTranscription(item.id, editValue);
    saveEdit(item.id);
    setIsEditing(false);
  };

  const handleCancel = () => {
    cancelEdit(item.id);
    setIsEditing(false);
    setEditValue(item.transcription);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Session Note
            </CardTitle>
            <CardDescription>
              {formatDate(item.dateTime)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {client && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {client.firstName} {client.lastName}
              </Badge>
            )}
            {item.isEdited && (
              <Badge variant="outline" className="text-xs">
                Edited
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Edit your session note..."
              className="min-h-[200px] resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">
                {item.transcription}
              </p>
            </div>
            <Button onClick={handleStartEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Note
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

