import React, { useState, useRef, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Code, Copy, Check } from "lucide-react";
import "../Block.css";
import "./CodeBlock.css";

/**
 * Code Block with syntax highlighting
 */
export default function CodeBlock({ data, onUpdate }) {
  const [code, setCode] = useState(data?.code || "");
  const [language, setLanguage] = useState(data?.language || "javascript");
  const [isEditing, setIsEditing] = useState(!code);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  const languages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "css",
    "html",
    "json",
    "markdown",
    "sql",
    "bash",
    "plaintext",
  ];

  useEffect(() => {
    if (code !== (data?.code || "") || language !== (data?.language || "javascript")) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        onUpdate({ code, language });
      }, 500);
    }
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [code, language, data?.code, data?.language, onUpdate]);

  const handleSave = () => {
    onUpdate({ code, language });
    setIsEditing(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
      }, 0);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setCode(data?.code || "");
    }
  };

  if (isEditing) {
    return (
      <div className="block code-block">
        <div className="code-block-header">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="code-language-select"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <textarea
          ref={textareaRef}
          className="code-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder="Enter code..."
          autoFocus
          spellCheck={false}
        />
      </div>
    );
  }

  return (
    <div className="block code-block">
      <div className="code-block-header">
        <div className="code-block-info">
          <Code size={16} />
          <span className="code-language-label">{language}</span>
        </div>
        <button className="code-copy-btn" onClick={handleCopy} title="Copy code">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <div className="code-block-content" onClick={() => setIsEditing(true)}>
        {code ? (
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: "var(--radius-md)",
              fontSize: "var(--font-size-sm)",
              background: "var(--color-panel)",
            }}
          >
            {code}
          </SyntaxHighlighter>
        ) : (
          <span className="block-placeholder">Click to add code...</span>
        )}
      </div>
    </div>
  );
}

