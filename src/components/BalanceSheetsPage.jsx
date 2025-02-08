// src/components/BalanceSheetsPage.jsx
import React, { useState } from 'react';
import BalanceSheetForm from './BalanceSheetForm';

const BalanceSheetsPage = ({ onNext }) => {
  // Dummy initial balance sheet data
  const [sheet, setSheet] = useState({
    id: 1,
    year: 2020,
    assets: {
      current: { Cash: 1000, 'Accounts Receivable': 500 },
      nonCurrent: { 'Property, Plant & Equipment': 3000 },
    },
    liabilities: {
      current: { 'Accounts Payable': 200 },
      longTerm: { 'Long-Term Debt': 1000 },
    },
    equity: {
      common: { 'Common Stock': 500, 'Retained Earnings': 250 },
      comprehensive: { 'Other': 0 },
    },
    income: 0,
    revenue: 0,
    profit: 0,
    operatingIncome: 0,
    netIncome: 0,
    interestExpense: 0,
    incomeTaxes: 0,
    depreciation: 0,
    amortization: 0,
  });

  const [validationErrors, setValidationErrors] = useState([]);

  const handleUpdate = (updatedSheet) => {
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
