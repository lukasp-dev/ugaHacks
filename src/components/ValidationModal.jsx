// src/components/ValidationModal.jsx
import React from 'react';

const ValidationModal = ({ errors, onCancel, onConfirm }) => {
  // Group errors by sheetYear so that each balance sheet year appears only once.
  const groupedErrors = {};
  errors.forEach((err) => {
    const sheetYear = err.sheetYear;
    let message;
    if (err.location.includes('>')) {
      const parts = err.location.split('>').map((s) => s.trim());
      let subheading = parts[1];
      // Map internal names to friendly titles.
      if (parts[0].toLowerCase() === 'assets') {
        if (subheading.toLowerCase() === 'current') subheading = 'Current Assets';
        else if (subheading.toLowerCase() === 'noncurrent' || subheading.toLowerCase() === 'nonCurrent')
          subheading = 'Non-Current Assets';
      } else if (parts[0].toLowerCase() === 'liabilities') {
        if (subheading.toLowerCase() === 'current') subheading = 'Current Liabilities';
        else if (subheading.toLowerCase() === 'longterm' || subheading.toLowerCase() === 'longTerm')
          subheading = 'Long-Term Liabilities';
      } else if (parts[0].toLowerCase() === 'equity') {
        if (subheading.toLowerCase() === 'common')
          subheading = 'Common Stock & Retained Earnings';
        else if (subheading.toLowerCase() === 'comprehensive')
          subheading = 'Accumulated Other Comprehensive Loss';
      }
      message = subheading;
    } else {
      message = err.location;
    }
    if (!groupedErrors[sheetYear]) {
      groupedErrors[sheetYear] = new Set();
    }
    groupedErrors[sheetYear].add(message);
  });

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Warning</h2>
        <p>
          The following fields have a value of <strong>0</strong>. Are you sure you want to continue?
        </p>
        <div className="modal-errors">
          {Object.keys(groupedErrors)
            .sort()
            .map((sheetYear) => (
              <div key={sheetYear} className="error-group">
                <div className="error-group-header">
                  Balance Sheet {sheetYear}:
                </div>
                {Array.from(groupedErrors[sheetYear]).map((message, idx) => (
                  <div key={idx} className="error-row">
                    {message} is 0.
                  </div>
                ))}
              </div>
            ))}
        </div>
        <div className="modal-buttons">
          <button className="modal-btn cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-btn confirm" onClick={onConfirm}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
