import React, { useState } from "react";
import TextBlock from "./blocks/TextBlock";
import MovieBlock from "./blocks/MovieBlock";
import NoteBlock from "./blocks/NoteBlock";
import TaskBlock from "./blocks/TaskBlock";
import CalendarBlock from "./blocks/CalendarBlock";
import { Icons } from "../utils/icons";
import "./BlockManager.css";

export default function BlockManager({ pageId, blocks = [], onUpdateBlocks }) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const addBlock = (type) => {
    const newBlock = {
      id: crypto.randomUUID(),
      type,
      data: getDefaultBlockData(type),
      createdAt: new Date().toISOString(),
    };
    onUpdateBlocks([...blocks, newBlock]);
    setShowAddMenu(false);
  };

  const updateBlock = (blockId, updates) => {
    onUpdateBlocks(
      blocks.map((block) =>
        block.id === blockId
          ? { ...block, data: { ...block.data, ...updates } }
          : block
      )
    );
  };

  const deleteBlock = (blockId) => {
    onUpdateBlocks(blocks.filter((block) => block.id !== blockId));
  };

  const moveBlock = (blockId, direction) => {
    const index = blocks.findIndex((b) => b.id === blockId);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [
      newBlocks[newIndex],
      newBlocks[index],
    ];
    onUpdateBlocks(newBlocks);
  };

  const blockTypes = [
    { type: "text", icon: Icons.text, label: "Text" },
    { type: "notes", icon: Icons.note, label: "Notes" },
    { type: "tasks", icon: Icons.task, label: "Tasks" },
    { type: "calendar", icon: Icons.calendar, label: "Calendar" },
  ];

  return (
    <div className="block-manager">
      {blocks.length === 0 && (
        <div className="empty-blocks-state">
          <p className="empty-blocks-message">This page is empty</p>
          <p className="empty-blocks-hint">Add a block to get started</p>
        </div>
      )}

      <div className="blocks-container">
        {blocks.map((block, index) => (
          <div key={block.id} className="block-wrapper">
            <BlockControls
              blockId={block.id}
              canMoveUp={index > 0}
              canMoveDown={index < blocks.length - 1}
              onMoveUp={() => moveBlock(block.id, "up")}
              onMoveDown={() => moveBlock(block.id, "down")}
              onDelete={() => deleteBlock(block.id)}
            />
            <BlockRenderer
              block={block}
              pageId={pageId}
              onUpdate={(updates) => updateBlock(block.id, updates)}
            />
          </div>
        ))}
      </div>

      <div className="add-block-container">
        {showAddMenu ? (
          <div className="add-block-menu">
            <button
              className="close-add-menu"
              onClick={() => setShowAddMenu(false)}
              aria-label="Close menu"
            >
              {Icons.close}
            </button>
            <div className="block-types-grid">
              {blockTypes.map(({ type, icon, label }) => (
                <button
                  key={type}
                  className="block-type-button"
                  onClick={() => addBlock(type)}
                  aria-label={`Add ${label} block`}
                >
                  <span className="block-type-icon">{icon}</span>
                  <span className="block-type-label">{label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            className="add-block-button"
            onClick={() => setShowAddMenu(true)}
            aria-label="Add block"
          >
            <span className="add-block-icon">{Icons.add}</span>
            <span className="add-block-text">Add block</span>
          </button>
        )}
      </div>
    </div>
  );
}

function BlockRenderer({ block, pageId, onUpdate }) {
  switch (block.type) {
    case "text":
      return <TextBlock data={block.data} onUpdate={onUpdate} />;
    case "movies":
      return (
        <MovieBlock pageId={pageId} data={block.data} onUpdate={onUpdate} />
      );
    case "notes":
      return (
        <NoteBlock pageId={pageId} data={block.data} onUpdate={onUpdate} />
      );
    case "tasks":
      return (
        <TaskBlock pageId={pageId} data={block.data} onUpdate={onUpdate} />
      );
    case "calendar":
      return (
        <CalendarBlock pageId={pageId} data={block.data} onUpdate={onUpdate} />
      );
    default:
      return <div>Unknown block type: {block.type}</div>;
  }
}

function BlockControls({
  blockId,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDelete,
}) {
  const [showControls, setShowControls] = useState(false);

  return (
    <div
      className="block-controls"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {showControls && (
        <div className="block-controls-buttons">
          <button
            className="block-control-btn"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            aria-label="Move up"
            title="Move up"
          >
            ↑
          </button>
          <button
            className="block-control-btn"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            aria-label="Move down"
            title="Move down"
          >
            ↓
          </button>
          <button
            className="block-control-btn delete"
            onClick={onDelete}
            aria-label="Delete block"
            title="Delete block"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

function getDefaultBlockData(type) {
  switch (type) {
    case "text":
      return { content: "" };
    case "movies":
      return {};
    case "notes":
      return { content: "" };
    case "tasks":
      return {};
    case "calendar":
      return {};
    default:
      return {};
  }
}
