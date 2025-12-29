import React from "react";
import "../Block.css";
import "./DividerBlock.css";

/**
 * Divider Block - Horizontal line
 */
export default function DividerBlock({ data, onUpdate }) {
  return (
    <div className="block divider-block">
      <hr className="divider-line" />
    </div>
  );
}

