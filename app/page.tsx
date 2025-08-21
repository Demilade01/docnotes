"use client";

import React from "react";
import { useClients } from "@/lib/stores/clients";
import { useTranscriptions } from "@/lib/stores/transcriptions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, FileText, Clock, Mic, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { clients } = useClients();
  const { items: notes } = useTranscriptions();

  // Calculate metrics
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const sessionsThisWeek = notes.filter(note =>
    new Date(note.dateTime) >= oneWeekAgo
  ).length;

  const sessionsThisMonth = notes.filter(note =>
    new Date(note.dateTime) >= oneMonthAgo
  ).length;

  // Mock upcoming appointments (in a real app, this would come from a calendar/booking system)
  const upcomingAppointments = 3;

  // Get recent client activity (last 5 notes with client info)
  const recentActivity = notes
    .filter(note => note.clientId)
    .slice(0, 5)
    .map(note => {
      const client = clients.find(c => c.id === note.clientId);
      return {
        ...note,
        clientName: client ? `${client.firstName} ${client.lastName}` : 'Unknown Client',
        notesSummary: note.transcription.length > 60
          ? note.transcription.substring(0, 60) + '...'
          : note.transcription
      };
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Dr. Amelia Carter</h1>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Sessions This Week</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{sessionsThisWeek}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Sessions This Month</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{sessionsThisMonth}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming Appointments</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{upcomingAppointments}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/record">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Mic className="h-4 w-4 mr-2" />
                Start New Recording
              </Button>
            </Link>
            <Link href="/clients">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Users className="h-4 w-4 mr-2" />
                View Client List
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Client Activity */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Client Activity</h2>
          <Card>
            <CardContent className="p-0">
              {recentActivity.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start recording your first session note</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Session Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes Summary
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentActivity.map((activity) => (
                        <tr key={activity.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {activity.clientName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(activity.dateTime)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {activity.notesSummary}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link href="/record">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                View Notes
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
