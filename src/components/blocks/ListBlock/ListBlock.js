import React, { useState, useRef, useEffect } from "react";
import { List, ListOrdered } from "lucide-react";
import "../Block.css";
import "./ListBlock.css";

/**
 * List Block - Ordered or Unordered list
 */
export default function ListBlock({ data, onUpdate }) {
  const [items, setItems] = useState(data?.items || [""]);
  const [type, setType] = useState(data?.type || "unordered"); // ordered, unordered
  const [isEditing, setIsEditing] = useState(!items.some(item => item.trim()));
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    const currentItems = data?.items || [""];
    if (JSON.stringify(items) !== JSON.stringify(currentItems) || type !== (data?.type || "unordered")) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        onUpdate({ items, type });
      }, 500);
    }
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [items, type, data?.items, data?.type, onUpdate]);

  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleItemKeyDown = (index, e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const newItems = [...items];
      newItems.splice(index + 1, 0, "");
      setItems(newItems);
      // Focus next input
      setTimeout(() => {
        const nextInput = document.querySelector(`.list-item-input[data-index="${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }, 0);
    }
    if (e.key === "Backspace" && items[index] === "" && items.length > 1) {
      e.preventDefault();
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      // Focus previous input
      if (index > 0) {
        setTimeout(() => {
          const prevInput = document.querySelector(`.list-item-input[data-index="${index - 1}"]`);
          if (prevInput) prevInput.focus();
        }, 0);
      }
    }
  };

  const handleSave = () => {
    onUpdate({ items: items.filter(item => item.trim() || items.length === 1), type });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="block list-block">
        <div className="list-block-controls">
          <button
            className={`list-type-btn ${type === "unordered" ? "active" : ""}`}
            onClick={() => setType("unordered")}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            className={`list-type-btn ${type === "ordered" ? "active" : ""}`}
            onClick={() => setType("ordered")}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
        </div>
        <div className={`list-items ${type === "ordered" ? "ordered" : "unordered"}`}>
          {items.map((item, index) => (
            <div key={index} className="list-item">
              {type === "ordered" ? (
                <span className="list-item-number">{index + 1}.</span>
              ) : (
                <span className="list-item-bullet">•</span>
              )}
              <input
                className="list-item-input"
                data-index={index}
                type="text"
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => handleItemKeyDown(index, e)}
                placeholder={`List item ${index + 1}`}
                autoFocus={index === 0 && items.length === 1}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const ListTag = type === "ordered" ? "ol" : "ul";
  const displayItems = items.filter(item => item.trim());

  return (
    <div
      className="block list-block"
      onClick={() => setIsEditing(true)}
    >
      {displayItems.length > 0 ? (
        <ListTag className={`list-content ${type}`}>
          {displayItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ListTag>
      ) : (
        <span className="block-placeholder">Click to add list...</span>
      )}
    </div>
  );
}

