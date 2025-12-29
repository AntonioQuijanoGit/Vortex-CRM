"use client";

import { useEffect, useState } from "react";
import { useExtendedStore } from "@/lib/store-extended";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag, X } from "lucide-react";
import { DEFAULT_TAGS } from "@/lib/constants";

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onCreateTag?: () => void;
}

export function TagSelector({ selectedTags, onTagsChange, onCreateTag }: TagSelectorProps) {
  const tags = useExtendedStore((state) => state.tags);
  const loadExtendedData = useExtendedStore((state) => state.loadExtendedData);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadExtendedData();
  }, [loadExtendedData]);

  // Combine default tags with custom tags
  const allTags = [
    ...DEFAULT_TAGS.map((name) => ({ id: name, name, color: "#3B82F6" })),
    ...tags,
  ];

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter((t) => t !== tagName));
    } else {
      onTagsChange([...selectedTags, tagName]);
    }
  };

  const removeTag = (tagName: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tagName));
  };

  const getTagColor = (tagName: string) => {
    const tag = tags.find((t) => t.name === tagName);
    if (tag) return tag.color;
    // Check if it's a default tag
    const defaultTag = DEFAULT_TAGS.includes(tagName);
    return defaultTag ? "#3B82F6" : "#6B7280";
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md">
        {selectedTags.length === 0 ? (
          <span className="text-sm text-muted-foreground">No tags selected</span>
        ) : (
          selectedTags.map((tag) => (
            <Badge
              key={tag}
              style={{ backgroundColor: getTagColor(tag), color: "white" }}
              className="flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:bg-black/20 rounded p-0.5"
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" type="button">
            <Tag className="mr-2 h-4 w-4" />
            {selectedTags.length > 0 ? `${selectedTags.length} tags` : "Select tags"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Tags</h4>
              {onCreateTag && (
                <Button variant="ghost" size="sm" onClick={onCreateTag}>
                  Manage Tags
                </Button>
              )}
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allTags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={tag.id}
                    checked={selectedTags.includes(tag.name)}
                    onCheckedChange={() => toggleTag(tag.name)}
                  />
                  <label
                    htmlFor={tag.id}
                    className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    <Badge
                      style={{ backgroundColor: tag.color, color: "white" }}
                      variant="default"
                    >
                      {tag.name}
                    </Badge>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

