import React, { useState } from "react";
import { Info, AlertCircle, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import "../Block.css";
import "./CalloutBlock.css";

/**
 * Callout Block - Highlighted information box
 */
export default function CalloutBlock({ data, onUpdate }) {
  const [type, setType] = useState(data?.type || "info");
  const [content, setContent] = useState(data?.content || "");

  const icons = {
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />,
    error: <AlertCircle size={20} />,
    success: <CheckCircle size={20} />,
    tip: <Lightbulb size={20} />,
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    onUpdate({ type: newType, content });
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    onUpdate({ type, content: newContent });
  };

  return (
    <div className={`block callout-block callout-${type}`}>
      <div className="callout-header">
        <div className="callout-icon">{icons[type] || icons.info}</div>
        <select className="callout-type-select" value={type} onChange={handleTypeChange}>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
          <option value="success">Success</option>
          <option value="tip">Tip</option>
        </select>
      </div>
      <textarea
        className="callout-content"
        value={content}
        onChange={handleContentChange}
        placeholder="Add your message..."
        rows={3}
      />
    </div>
  );
}

