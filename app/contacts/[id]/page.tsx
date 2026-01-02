"use client";

import { useEffect } from "react";
import { useInitialize } from "@/hooks/use-initialize";
import { useParams, useRouter } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { NotesSection } from "@/components/contacts/notes-section";
import { EnhancedTimeline } from "@/components/shared/enhanced-timeline";
export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params.id as string;
  const getContact = useCRMStore((state) => state.getContact);
  const deleteContact = useCRMStore((state) => state.deleteContact);
  const getDealsByContact = useCRMStore((state) => state.getDealsByContact);
  const getActivitiesByContact = useCRMStore((state) => state.getActivitiesByContact);
  const getNotesByContact = useCRMStore((state) => state.getNotesByContact);
  const settings = useCRMStore((state) => state.settings);
  useInitialize();
  const contact = getContact(contactId);
  const deals = getDealsByContact(contactId);
  const activities = getActivitiesByContact(contactId);
  const notes = getNotesByContact(contactId);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleDelete = () => {
    if (contact && confirm(`Are you sure you want to delete ${contact.name}?`)) {
      deleteContact(contact.id);
      toast.success("Contact deleted");
      router.push("/contacts");
    }
  };

  if (!contact) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-7xl">
              <p>Contact not found</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/contacts">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{contact.name}</h1>
                <p className="text-muted-foreground">{contact.company}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/contacts?edit=${contact.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="deals">Deals ({deals.length})</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{contact.email}</p>
                      </div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{contact.phone}</p>
                        <p className="text-sm text-muted-foreground">Position</p>
                        <p className="font-medium">{contact.position}</p>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge variant="outline">{contact.status}</Badge>
                    </CardContent>
                  </Card>
                      <CardTitle>Details</CardTitle>
                        <p className="text-sm text-muted-foreground">Total Value</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(contact.value)}
                        </p>
                        <p className="text-sm text-muted-foreground">Tags</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {contact.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="font-medium">
                          {format(new Date(contact.createdAt), "MMMM dd, yyyy")}
                </div>
                {contact.notes && (
                      <CardTitle>Notes</CardTitle>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{contact.notes}</p>
                )}
              </TabsContent>
              <TabsContent value="deals" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Deals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {deals.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No deals for this contact
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {deals.map((deal) => (
                          <div
                            key={deal.id}
                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                          >
                            <div>
                              <p className="font-medium">{deal.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(deal.value)} • {deal.status}
                              </p>
                            </div>
                            <Link href={`/pipeline?deal=${deal.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                          </div>
                        ))}
                    )}
                  </CardContent>
                </Card>
              <TabsContent value="activity" className="space-y-4">
                    <CardTitle>Activity Timeline</CardTitle>
                    <EnhancedTimeline contactId={contactId} />
              <TabsContent value="notes" className="space-y-4">
                  <CardContent className="pt-6">
                    <NotesSection contactId={contactId} />
            </Tabs>
          </div>
        </main>
    </div>
  );
}
