import React from "react";
import DraggableBlockManager from "./DraggableBlockManager";
import "./BlockManager.css";

export default function BlockManager({ pageId, blocks = [], onUpdateBlocks }) {
  return (
    <DraggableBlockManager
      pageId={pageId}
      blocks={blocks}
      onUpdateBlocks={onUpdateBlocks}
    />
  );
}
