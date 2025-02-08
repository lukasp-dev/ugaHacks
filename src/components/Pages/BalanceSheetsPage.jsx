import React from 'react';
import BalanceSheetForm from './BalanceSheetForm';

const BalanceSheetsPage = ({ onNext }) => {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Balance Sheets</h2>
      {/* Render your BalanceSheetForm(s) here */}
      <BalanceSheetForm />
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={onNext} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
          NEXT
        </button>
      </div>
    </div>
  );
};

export default BalanceSheetsPage;
