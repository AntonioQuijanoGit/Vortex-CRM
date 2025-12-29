"use client";

import { useState } from "react";
import { useCRMStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface NotesSectionProps {
  contactId?: string;
  dealId?: string;
}

export function NotesSection({ contactId, dealId }: NotesSectionProps) {
  const notes = useCRMStore((state) => {
    if (contactId) return state.getNotesByContact(contactId);
    if (dealId) return state.getNotesByDeal(dealId);
    return [];
  });
  const addNote = useCRMStore((state) => state.addNote);
  const deleteNote = useCRMStore((state) => state.deleteNote);
  const [isAdding, setIsAdding] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  const handleAddNote = () => {
    if (!noteContent.trim()) {
      toast.error("Note content is required");
      return;
    }

    addNote({
      content: noteContent.trim(),
      contactId,
      dealId,
    });

    setNoteContent("");
    setIsAdding(false);
    toast.success("Note added");
  };

  const formatMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^- (.*)$/gm, "<li>$1</li>")
      .replace(/\n/g, "<br />");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notes</h3>
        {!isAdding && (
          <Button size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="space-y-3 p-4 border rounded-lg bg-card">
          <RichTextEditor
            value={noteContent}
            onChange={setNoteContent}
            placeholder="Write a note..."
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAdding(false);
                setNoteContent("");
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddNote}>
              Save Note
            </Button>
          </div>
        </div>
      )}

      {notes.length === 0 && !isAdding ? (
        <p className="text-center text-muted-foreground py-8">
          No notes yet. Click &quot;Add Note&quot; to create one.
        </p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="border rounded-lg p-4 space-y-2">
              <div
                className="text-sm prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(note.content) }}
              />
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  {format(new Date(note.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    if (confirm("Delete this note?")) {
                      deleteNote(note.id);
                      toast.success("Note deleted");
                    }
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

