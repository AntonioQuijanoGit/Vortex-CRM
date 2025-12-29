import React from "react";
import { TodoApp } from "../../Todo";
import { Icons, renderIcon } from "../../../utils/icons";
import "../Block.css";

export default function TaskBlock({ pageId, data, onUpdate }) {
  return (
    <div className="block task-block">
      <div className="block-header">
        <span className="block-icon">{renderIcon(Icons.task, 18)}</span>
        <h3 className="block-title">Tasks</h3>
      </div>
      <TodoApp pageId={pageId ? `${pageId}-tasks` : "tasks"} viewType="list" />
    </div>
  );
}

