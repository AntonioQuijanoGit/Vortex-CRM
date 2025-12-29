import React, { useState } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";
import "../Block.css";
import "./CounterBlock.css";

/**
 * Counter Block - Simple counter widget
 */
export default function CounterBlock({ data, onUpdate }) {
  const [count, setCount] = useState(data?.count ?? 0);
  const [label, setLabel] = useState(data?.label || "Counter");
  const [step, setStep] = useState(data?.step ?? 1);

  const handleIncrement = () => {
    const newCount = count + step;
    setCount(newCount);
    onUpdate({ count: newCount, label, step });
  };

  const handleDecrement = () => {
    const newCount = Math.max(0, count - step);
    setCount(newCount);
    onUpdate({ count: newCount, label, step });
  };

  const handleReset = () => {
    setCount(0);
    onUpdate({ count: 0, label, step });
  };

  const handleLabelChange = (e) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    onUpdate({ count, label: newLabel, step });
  };

  const handleStepChange = (e) => {
    const newStep = Math.max(1, parseInt(e.target.value) || 1);
    setStep(newStep);
    onUpdate({ count, label, step: newStep });
  };

  return (
    <div className="block counter-block">
      <div className="counter-header">
        <input
          className="counter-label"
          type="text"
          value={label}
          onChange={handleLabelChange}
          placeholder="Counter name"
        />
        <div className="counter-step-control">
          <label>Step:</label>
          <input
            type="number"
            min="1"
            value={step}
            onChange={handleStepChange}
            className="counter-step-input"
          />
        </div>
      </div>
      <div className="counter-display">
        <div className="counter-value">{count}</div>
        <div className="counter-controls">
          <button className="counter-btn" onClick={handleDecrement} aria-label="Decrease">
            <Minus size={20} />
          </button>
          <button className="counter-btn reset" onClick={handleReset} aria-label="Reset">
            <RotateCcw size={18} />
          </button>
          <button className="counter-btn" onClick={handleIncrement} aria-label="Increase">
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

