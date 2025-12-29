import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TextBlock, NoteBlock, TaskBlock, CalendarBlock, MovieBlock, RichTextBlock, HeadingBlock, ListBlock, QuoteBlock, DividerBlock, CodeBlock, TimerBlock, ImageBlock, ToggleBlock, CalloutBlock, EmbedBlock, CounterBlock } from "../Blocks";
import { Icons } from "../../utils/icons";
import { EmptyState } from "../shared";
import "./BlockManager.css";

/**
 * Draggable Block Manager with @dnd-kit
 */
export default function DraggableBlockManager({ pageId, blocks = [], onUpdateBlocks }) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      onUpdateBlocks(arrayMove(blocks, oldIndex, newIndex));
    }
  };

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

    onUpdateBlocks(arrayMove(blocks, index, newIndex));
  };

  const blockTypes = [
    { type: "rich-text", icon: Icons.text, label: "Rich Text" },
    { type: "heading", icon: Icons.text, label: "Heading" },
    { type: "text", icon: Icons.text, label: "Text" },
    { type: "list", icon: Icons.text, label: "List" },
    { type: "quote", icon: Icons.text, label: "Quote" },
    { type: "divider", icon: Icons.text, label: "Divider" },
    { type: "code", icon: Icons.text, label: "Code" },
    { type: "timer", icon: Icons.stats, label: "Timer" },
    { type: "notes", icon: Icons.note, label: "Notes" },
    { type: "tasks", icon: Icons.task, label: "Tasks" },
    { type: "calendar", icon: Icons.calendar, label: "Calendar" },
    { type: "movies", icon: Icons.movie, label: "Movies" },
  ];

  return (
    <div className="block-manager">
      {blocks.length === 0 && (
        <EmptyState
          message="This page is empty"
          hint="Add a block to get started"
        />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="blocks-container">
            {blocks.map((block, index) => (
              <SortableBlockWrapper
                key={block.id}
                block={block}
                pageId={pageId}
                index={index}
                canMoveUp={index > 0}
                canMoveDown={index < blocks.length - 1}
                onMoveUp={() => moveBlock(block.id, "up")}
                onMoveDown={() => moveBlock(block.id, "down")}
                onUpdate={(updates) => updateBlock(block.id, updates)}
                onDelete={() => deleteBlock(block.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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

function SortableBlockWrapper({
  block,
  pageId,
  index,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onUpdate,
  onDelete,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="block-wrapper">
      <BlockControls
        blockId={block.id}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
      <BlockRenderer
        block={block}
        pageId={pageId}
        onUpdate={onUpdate}
      />
    </div>
  );
}

function BlockRenderer({ block, pageId, onUpdate }) {
  switch (block.type) {
    case "rich-text":
      return <RichTextBlock data={block.data} onUpdate={onUpdate} />;
    case "heading":
      return <HeadingBlock data={block.data} onUpdate={onUpdate} />;
    case "text":
      return <TextBlock data={block.data} onUpdate={onUpdate} />;
    case "list":
      return <ListBlock data={block.data} onUpdate={onUpdate} />;
    case "quote":
      return <QuoteBlock data={block.data} onUpdate={onUpdate} />;
    case "divider":
      return <DividerBlock data={block.data} onUpdate={onUpdate} />;
    case "code":
      return <CodeBlock data={block.data} onUpdate={onUpdate} />;
    case "image":
      return <ImageBlock data={block.data} onUpdate={onUpdate} />;
    case "toggle":
      return <ToggleBlock data={block.data} onUpdate={onUpdate} />;
    case "callout":
      return <CalloutBlock data={block.data} onUpdate={onUpdate} />;
    case "embed":
      return <EmbedBlock data={block.data} onUpdate={onUpdate} />;
    case "timer":
      return <TimerBlock data={block.data} onUpdate={onUpdate} />;
    case "counter":
      return <CounterBlock data={block.data} onUpdate={onUpdate} />;
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
    case "movies":
      return (
        <MovieBlock pageId={pageId} data={block.data} onUpdate={onUpdate} />
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
  dragHandleProps,
}) {
  const [showControls, setShowControls] = React.useState(false);

  return (
    <div
      className="block-controls"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {showControls && (
        <div className="block-controls-buttons">
          <button
            className="block-control-btn drag-handle"
            {...dragHandleProps}
            aria-label="Drag to reorder"
            title="Drag to reorder"
          >
            {Icons.menu}
          </button>
          <button
            className="block-control-btn"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            aria-label="Move up"
            title="Move up"
          >
            {Icons.arrowUp}
          </button>
          <button
            className="block-control-btn"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            aria-label="Move down"
            title="Move down"
          >
            {Icons.arrowDown}
          </button>
          <button
            className="block-control-btn delete"
            onClick={onDelete}
            aria-label="Delete block"
            title="Delete block"
          >
            {Icons.delete}
          </button>
        </div>
      )}
    </div>
  );
}

function getDefaultBlockData(type) {
  switch (type) {
    case "rich-text":
      return { content: "" };
    case "heading":
      return { text: "", level: 1 };
    case "text":
      return { content: "" };
    case "list":
      return { items: [""], type: "unordered" };
    case "quote":
      return { text: "", author: "" };
    case "divider":
      return {};
    case "code":
      return { code: "", language: "javascript" };
    case "image":
      return { url: "", src: "", caption: "" };
    case "toggle":
      return { title: "Toggle", content: "", isOpen: false };
    case "callout":
      return { type: "info", content: "" };
    case "embed":
      return { url: "", embedType: "url" };
    case "timer":
      return { minutes: 25, seconds: 0, mode: "pomodoro", isRunning: false, isPaused: false };
    case "counter":
      return { count: 0, label: "Counter", step: 1 };
    case "notes":
      return { content: "" };
    case "tasks":
      return {};
    case "calendar":
      return {};
    case "movies":
      return {};
    default:
      return {};
  }
}

