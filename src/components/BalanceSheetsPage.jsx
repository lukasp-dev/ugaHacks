// src/components/BalanceSheetsPage.jsx
import React, { useState } from 'react';
import BalanceSheetForm from './BalanceSheetForm';
import { defaultBalanceSheet } from '../utils/balanceSheetUtils';

const BalanceSheetsPage = ({ onNext }) => {
  // Initialize with our defaultBalanceSheet. We pass an empty string for the company name.
  const [sheet, setSheet] = useState(defaultBalanceSheet(1, new Date().getFullYear(), ''));
  const [validationErrors, setValidationErrors] = useState([]);

  const handleUpdate = (updatedSheet) => {
    console.log("Updating sheet with:", updatedSheet);
    setSheet(updatedSheet);
  };

  const handleDelete = (sheetId) => {
    console.log("Deleted sheet with id", sheetId);
  };

  const handleAddPrevious = (year) => {
    console.log("Add previous sheet for year", year);
  };

  const handleAddNext = (year) => {
    console.log("Add next sheet for year", year);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Balance Sheets</h2>
      <BalanceSheetForm
        sheet={sheet}
        onUpdate={handleUpdate}
        validationErrors={validationErrors}
        onDelete={handleDelete}
        onAddPrevious={handleAddPrevious}
        onAddNext={handleAddNext}
      />
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={onNext} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
          NEXT
        </button>
      </div>
    </div>
  );
};

export default BalanceSheetsPage;
