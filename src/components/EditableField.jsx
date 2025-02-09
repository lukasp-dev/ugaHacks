// src/components/EditableField.jsx
import React, { useState, useEffect } from 'react';

const EditableField = ({
  value,
  onChange,
  inputType = "number", // Allowed values: "number" (default), "year", or "text"
  fieldId,
  error
}) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
    console.log(`EditableField ${fieldId} received new value:`, value);
  }, [value, fieldId]);

  const handleClick = (e) => {
    e.stopPropagation();
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    if (inputType === "number") {
      onChange(Number(localValue));
    } else if (inputType === "year") {
      onChange(parseInt(localValue, 10));
    } else {
      // For "text"
      onChange(localValue);
    }
  };

  const handleChange = (e) => setLocalValue(e.target.value);

  return editing ? (
    <input
      className={`editable-input ${error ? 'error' : ''}`}
      type={inputType === "number" || inputType === "year" ? "number" : "text"}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      autoFocus
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    />
  ) : (
    <span className={`editable-field ${error ? 'error' : ''}`} onClick={handleClick}>
      {inputType === "number" ? `$${Number(localValue).toLocaleString()}` : localValue}
    </span>
  );
};

export default EditableField;
