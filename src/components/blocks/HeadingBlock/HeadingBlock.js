import React, { useState, useRef, useEffect } from "react";
import "../Block.css";
import "./HeadingBlock.css";

/**
 * Heading Block - H1, H2, H3, H4, H5, H6
 */
export default function HeadingBlock({ data, onUpdate }) {
  const [text, setText] = useState(data?.text || "");
  const [level, setLevel] = useState(data?.level || 1);
  const [isEditing, setIsEditing] = useState(!text);
  const inputRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (text !== (data?.text || "")) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        onUpdate({ text, level });
      }, 500);
    }
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [text, level, data?.text, data?.level, onUpdate]);

  const handleSave = () => {
    onUpdate({ text, level });
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setText(data?.text || "");
    }
  };

  const HeadingTag = `h${level}`;

  if (isEditing) {
    return (
      <div className="block heading-block">
        <div className="heading-block-controls">
          <select
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="heading-level-select"
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
            <option value={4}>H4</option>
            <option value={5}>H5</option>
            <option value={6}>H6</option>
          </select>
        </div>
        <input
          ref={inputRef}
          type="text"
          className={`heading-input heading-level-${level}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder={`Heading ${level}`}
          autoFocus
        />
      </div>
    );
  }

  return (
    <div
      className="block heading-block"
      onClick={() => setIsEditing(true)}
    >
      <HeadingTag className={`heading-content heading-level-${level}`}>
        {text || <span className="block-placeholder">Click to add heading...</span>}
      </HeadingTag>
    </div>
  );
}

