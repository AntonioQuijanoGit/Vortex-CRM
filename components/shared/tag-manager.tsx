"use client";

import { useEffect, useState } from "react";
import { useExtendedStore } from "@/lib/store-extended";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { TAG_COLORS } from "@/lib/constants";
import { toast } from "sonner";

interface TagManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TagManager({ open, onOpenChange }: TagManagerProps) {
  const tags = useExtendedStore((state) => state.tags);
  const addTag = useExtendedStore((state) => state.addTag);
  const updateTag = useExtendedStore((state) => state.updateTag);
  const deleteTag = useExtendedStore((state) => state.deleteTag);
  const loadExtendedData = useExtendedStore((state) => state.loadExtendedData);

  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);

  useEffect(() => {
    if (open) {
      loadExtendedData();
    }
  }, [open, loadExtendedData]);

  const handleAddTag = () => {
    if (!newTagName.trim()) {
      toast.error("Tag name is required");
      return;
    }

    if (tags.some((t) => t.name.toLowerCase() === newTagName.toLowerCase())) {
      toast.error("Tag already exists");
      return;
    }

    addTag(newTagName.trim(), newTagColor);
    setNewTagName("");
    toast.success("Tag created");
  };

  const handleDeleteTag = (id: string) => {
    if (confirm("Are you sure you want to delete this tag?")) {
      deleteTag(id);
      toast.success("Tag deleted");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>
            Add, edit, or delete tags for organizing your data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              />
              <div className="flex gap-1">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewTagColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      newTagColor === color ? "border-foreground" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
              <Button onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Existing Tags</Label>
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-4 border rounded-lg">
              {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tags yet</p>
              ) : (
                tags.map((tag) => (
                  <div key={tag.id} className="flex items-center gap-2">
                    <Badge
                      style={{ backgroundColor: tag.color, color: "white" }}
                      className="flex items-center gap-2"
                    >
                      {tag.name}
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="ml-1 hover:bg-black/20 rounded p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}









