// src/components/EditableField.jsx
import React, { useState } from 'react';

const EditableField = ({ value, onChange, isYear, fieldId, error }) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleClick = (e) => {
    e.stopPropagation();
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
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
    <span
      className={`editable-field ${error ? 'error' : ''}`}
      onClick={handleClick}
    >
      {isYear ? localValue : `$${Number(value).toLocaleString()}`}
    </span>
  );
};

export default EditableField;
