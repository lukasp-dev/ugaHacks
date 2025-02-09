// src/components/EditableField.jsx
import React, { useState, useEffect } from 'react';

const EditableField = ({ value, onChange, isYear, fieldId, error }) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Update localValue whenever the incoming value prop changes.
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
    // Ensure we pass a number (or an integer if isYear) back to onChange.
    onChange(isYear ? parseInt(localValue, 10) : Number(localValue));
  };

  const handleChange = (e) => setLocalValue(e.target.value);

  return editing ? (
    <input
      className={`editable-input ${error ? 'error' : ''}`}
      type="number"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      autoFocus
    />
  ) : (
    <span className={`editable-field ${error ? 'error' : ''}`} onClick={handleClick}>
      {isYear ? localValue : `$${Number(localValue).toLocaleString()}`}
    </span>
  );
};

export default EditableField;
