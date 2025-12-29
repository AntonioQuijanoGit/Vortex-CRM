import React, { useState } from "react";
import { X, Tag } from "lucide-react";
import { DEFAULT_TAGS } from "../../../utils/tags";
import "./TagSelector.css";

/**
 * Tag Selector Component
 */
export default function TagSelector({ selectedTags = [], availableTags = DEFAULT_TAGS, onChange }) {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = (tagId) => {
    if (!selectedTags.includes(tagId)) {
      onChange([...selectedTags, tagId]);
    }
  };

  const handleRemoveTag = (tagId) => {
    onChange(selectedTags.filter(id => id !== tagId));
  };

  const handleCreateTag = () => {
    if (inputValue.trim()) {
      const newTag = {
        id: inputValue.trim().toLowerCase().replace(/\s+/g, "-"),
        name: inputValue.trim(),
        color: "#666666",
      };
      handleAddTag(newTag.id);
      setInputValue("");
      setShowInput(false);
    }
  };

  return (
    <div className="tag-selector">
      <div className="selected-tags">
        {selectedTags.map(tagId => {
          const tag = availableTags.find(t => t.id === tagId) || { id: tagId, name: tagId, color: "#666666" };
          return (
            <span
              key={tagId}
              className="tag-badge"
              style={{ backgroundColor: tag.color + "20", borderColor: tag.color, color: tag.color }}
            >
              {tag.name}
              <button
                className="tag-remove"
                onClick={() => handleRemoveTag(tagId)}
                aria-label={`Remove ${tag.name}`}
              >
                <X size={12} />
              </button>
            </span>
          );
        })}
      </div>
      <div className="tag-actions">
        {!showInput ? (
          <button
            className="tag-add-btn"
            onClick={() => setShowInput(true)}
            aria-label="Add tag"
          >
            <Tag size={14} />
            Add tag
          </button>
        ) : (
          <div className="tag-input-container">
            <input
              type="text"
              className="tag-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateTag();
                if (e.key === "Escape") {
                  setShowInput(false);
                  setInputValue("");
                }
              }}
              placeholder="Tag name..."
              autoFocus
            />
            <div className="tag-suggestions">
              {availableTags
                .filter(tag => !selectedTags.includes(tag.id))
                .map(tag => (
                  <button
                    key={tag.id}
                    className="tag-suggestion"
                    onClick={() => handleAddTag(tag.id)}
                    style={{ borderColor: tag.color, color: tag.color }}
                  >
                    {tag.name}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

