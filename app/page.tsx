"use client";

import React from "react";
import { useClients } from "@/lib/stores/clients";
import { useTranscriptions } from "@/lib/stores/transcriptions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, FileText, Clock, Mic, ArrowRight, TrendingUp, Activity } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, Dr. Amelia Carter</h1>
          <p className="mt-2 text-muted-foreground">Here&apos;s what&apos;s happening with your practice today</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sessions This Week</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{sessionsThisWeek}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {sessionsThisWeek > 0 ? '+12% from last week' : 'No sessions yet'}
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sessions This Month</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{sessionsThisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {sessionsThisMonth > 0 ? '+8% from last month' : 'No sessions yet'}
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{clients.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {clients.length > 0 ? 'Total registered clients' : 'No clients yet'}
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Appointments</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{upcomingAppointments}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Next: Today at 2:00 PM
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/record">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200">
                <Mic className="h-4 w-4 mr-2" />
                Start New Recording
              </Button>
            </Link>
            <Link href="/clients">
              <Button variant="outline" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground">
                <Users className="h-4 w-4 mr-2" />
                View Client List
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Client Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Client Activity</h2>
            <Badge variant="secondary" className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Live Updates
            </Badge>
          </div>
          <Card className="card-hover">
            <CardContent className="p-0">
              {recentActivity.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No recent activity</h3>
                  <p className="text-muted-foreground mb-4">Start recording your first session note to see activity here</p>
                  <Link href="/record">
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Mic className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Client Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Last Session Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Notes Summary
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {recentActivity.map((activity) => (
                          <tr key={activity.id} className="hover:bg-accent/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                  <span className="text-sm font-medium text-primary">
                                    {activity.clientName.charAt(0)}
                                  </span>
                                </div>
                                <div className="text-sm font-medium text-foreground">
                                  {activity.clientName}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-muted-foreground">
                                {formatDate(activity.dateTime)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-foreground max-w-xs truncate">
                                {activity.notesSummary}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href="/record">
                                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
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
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
