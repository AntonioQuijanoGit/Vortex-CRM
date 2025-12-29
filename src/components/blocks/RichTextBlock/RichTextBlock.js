import React, { useState, useEffect, useRef, useCallback } from "react";
import { SlashCommandMenu } from "./SlashCommandMenu";
import { FormattingToolbar } from "./FormattingToolbar";
import "../Block.css";
import "./RichTextBlock.css";

/**
 * Rich Text Block with formatting, markdown shortcuts, and slash commands
 */
export default function RichTextBlock({ data, onUpdate }) {
  const [content, setContent] = useState(data?.content || "");
  const [isEditing, setIsEditing] = useState(!content);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const editorRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Auto-save
  useEffect(() => {
    if (content !== (data?.content || "")) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        onUpdate({ content });
      }, 500);
    }
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, data?.content, onUpdate]);

  const insertCommandResult = useCallback((command, position) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    
    let insertHTML = "";
    let newCursorPos = position;

    switch (command) {
      case "heading1":
        insertHTML = "<h1>Heading 1</h1>";
        newCursorPos = position + 10;
        break;
      case "heading2":
        insertHTML = "<h2>Heading 2</h2>";
        newCursorPos = position + 10;
        break;
      case "heading3":
        insertHTML = "<h3>Heading 3</h3>";
        newCursorPos = position + 10;
        break;
      case "bullet-list":
        insertHTML = "<ul><li>List item</li></ul>";
        newCursorPos = position + 19;
        break;
      case "numbered-list":
        insertHTML = "<ol><li>List item</li></ol>";
        newCursorPos = position + 19;
        break;
      case "quote":
        insertHTML = "<blockquote>Quote</blockquote>";
        newCursorPos = position + 6;
        break;
      case "divider":
        insertHTML = "<hr>";
        newCursorPos = position + 4;
        break;
      case "code":
        insertHTML = "<pre><code>Code block</code></pre>";
        newCursorPos = position + 11;
        break;
      default:
        return;
    }

    try {
      range.setStart(range.startContainer, position);
      range.deleteContents();
      
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = insertHTML;
      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      range.insertNode(fragment);
      
      range.setStart(range.startContainer, newCursorPos);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      
      updateContent();
    } catch (error) {
      console.error("Error inserting command:", error);
    }
  }, []);

  // Handle slash command
  const handleSlashCommand = useCallback((command) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;
    
    if (textNode.nodeType === Node.TEXT_NODE) {
      const text = textNode.textContent;
      const cursorPos = range.startOffset;
      const beforeCursor = text.substring(0, cursorPos);
      const afterCursor = text.substring(cursorPos);
      
      // Remove the "/" and command
      const slashIndex = beforeCursor.lastIndexOf("/");
      if (slashIndex !== -1) {
        const newText = beforeCursor.substring(0, slashIndex) + afterCursor;
        textNode.textContent = newText;
        
        // Insert command result
        insertCommandResult(command, slashIndex);
      }
    }
    
    setShowSlashMenu(false);
  }, [insertCommandResult]);

  const updateContent = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleInput = (e) => {
    const text = e.target.textContent || "";
    const cursorPos = window.getSelection().getRangeAt(0).startOffset;
    const beforeCursor = text.substring(0, cursorPos);
    
    // Check for slash command
    if (beforeCursor.endsWith("/") && !showSlashMenu) {
      const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
      setSlashMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setShowSlashMenu(true);
    } else if (!beforeCursor.endsWith("/") && showSlashMenu) {
      setShowSlashMenu(false);
    }
    
    updateContent();
  };

  const handleKeyDown = (e) => {
    // Markdown shortcuts
    if (e.ctrlKey || e.metaKey) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      switch (e.key) {
        case "b":
          e.preventDefault();
          document.execCommand("bold", false, null);
          updateContent();
          break;
        case "i":
          e.preventDefault();
          document.execCommand("italic", false, null);
          updateContent();
          break;
        case "k":
          e.preventDefault();
          document.execCommand("createLink", false, "#");
          updateContent();
          break;
        case "Enter":
          if (e.shiftKey) {
            // Allow new line
            return;
          }
          e.preventDefault();
          document.execCommand("insertParagraph", false, null);
          updateContent();
          break;
        default:
          break;
      }
    }

    // Escape to close menus
    if (e.key === "Escape") {
      setShowSlashMenu(false);
      setShowToolbar(false);
    }
  };

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      setShowToolbar(false);
      return;
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      setShowToolbar(false);
      return;
    }

    const selectedText = selection.toString();
    if (selectedText) {
      const rect = range.getBoundingClientRect();
      setToolbarPosition({
        top: rect.top + window.scrollY - 50,
        left: rect.left + window.scrollX + rect.width / 2,
      });
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    updateContent();
    setShowToolbar(false);
    window.getSelection().removeAllRanges();
  };

  if (isEditing) {
    return (
      <div className="block rich-text-block">
        {showToolbar && (
          <FormattingToolbar
            position={toolbarPosition}
            onFormat={handleFormat}
            onClose={() => setShowToolbar(false)}
          />
        )}
        {showSlashMenu && (
          <SlashCommandMenu
            position={slashMenuPosition}
            onSelect={handleSlashCommand}
            onClose={() => setShowSlashMenu(false)}
          />
        )}
        <div
          ref={editorRef}
          className="rich-text-editor"
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          dangerouslySetInnerHTML={{ __html: content || "" }}
          data-placeholder="Type '/' for commands, or start writing..."
        />
        <div className="block-hint">
          <span>Bold: Ctrl+B</span>
          <span>Italic: Ctrl+I</span>
          <span>Link: Ctrl+K</span>
          <span>Slash: /</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="block rich-text-block"
      onClick={() => setIsEditing(true)}
      dangerouslySetInnerHTML={{ __html: content || '<span class="block-placeholder">Click to add text...</span>' }}
    />
  );
}

