import React, { useState, useRef, useEffect } from "react";
import { Quote } from "lucide-react";
import "../Block.css";
import "./QuoteBlock.css";

/**
 * Quote Block
 */
export default function QuoteBlock({ data, onUpdate }) {
  const [text, setText] = useState(data?.text || "");
  const [author, setAuthor] = useState(data?.author || "");
  const [isEditing, setIsEditing] = useState(!text);
  const textRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (text !== (data?.text || "") || author !== (data?.author || "")) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        onUpdate({ text, author });
      }, 500);
    }
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [text, author, data?.text, data?.author, onUpdate]);

  const handleSave = () => {
    onUpdate({ text, author });
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setText(data?.text || "");
      setAuthor(data?.author || "");
    }
  };

  if (isEditing) {
    return (
      <div className="block quote-block">
        <div className="quote-block-icon">
          <Quote size={20} />
        </div>
        <div className="quote-block-content">
          <textarea
            ref={textRef}
            className="quote-text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder="Quote text..."
            autoFocus
          />
          <input
            type="text"
            className="quote-author-input"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder="Author (optional)"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="block quote-block"
      onClick={() => setIsEditing(true)}
    >
      <div className="quote-block-icon">
        <Quote size={20} />
      </div>
      <div className="quote-block-content">
        {text ? (
          <>
            <blockquote className="quote-text">{text}</blockquote>
            {author && <cite className="quote-author">— {author}</cite>}
          </>
        ) : (
          <span className="block-placeholder">Click to add quote...</span>
        )}
      </div>
    </div>
  );
}

