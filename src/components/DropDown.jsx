import React, { useState, useEffect } from 'react';
import { sumValues } from '../utils/balanceSheetUtils';
import EditableField from './EditableField';

const Dropdown = ({
  title,
  fields,
  onFieldChange,
  sheetId,
  section,
  subSection,
  validationErrors,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fieldHasError = Object.keys(fields).some((field) => {
      const fieldId = `sheet-${sheetId}.${section}.${subSection}.${field}`;
      return validationErrors && validationErrors.includes(fieldId);
    });
    if (fieldHasError) setOpen(true);
  }, [validationErrors, fields, sheetId, section, subSection]);

  const toggleOpen = () => setOpen(!open);
  const total = sumValues(fields);

  return (
    <div className={`dropdown ${open ? 'open' : ''}`}>
      <div className="dropdown-header" style={{ cursor: 'default' }}>
        <span className="dropdown-title">{title}</span>
        <span className="dropdown-total">${total.toLocaleString()}</span>
        <span 
          className="dropdown-toggle" 
          style={{ cursor: 'pointer' }}
          onClick={(e) => { 
            e.stopPropagation(); 
            toggleOpen(); 
          }}
        >
          {open ? '-' : '+'}
        </span>
      </div>
      <div className="dropdown-content" onClick={(e) => e.stopPropagation()}>
        {Object.keys(fields).map((field, idx) => {
          const fieldId = `sheet-${sheetId}.${section}.${subSection}.${field}`;
          const hasError = validationErrors && validationErrors.includes(fieldId);
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.3rem 0',
              }}
            >
              <span>{field}</span>
              <EditableField
                value={fields[field]}
                onChange={(newVal) => onFieldChange(field, newVal)}
                fieldId={fieldId}
                error={hasError}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dropdown;
