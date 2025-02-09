// src/components/BalanceSheetsPage.jsx
import React from 'react';
import BalanceSheetForm from './BalanceSheetForm';
import { getAllBalanceSheets } from '../utils/sheetHelpers';

/**
 * BalanceSheetsPage expects:
 *  - companies: an array of company objects, where each company has:
 *      id, name, and sheets (an array of balance sheet form objects)
 *  - onUpdateCompanies: a callback to update the companies data in the parent.
 *  - onNext: a callback triggered when the user clicks NEXT.
 */
const BalanceSheetsPage = ({ companies, onUpdateCompanies, onNext }) => {
  if (!companies || companies.length === 0) {
    return <div style={{ padding: '1rem' }}>No companies available.</div>;
  }

  // Update a specific balance sheet within a company.
  const handleUpdateSheet = (companyId, updatedSheet) => {
    const updatedCompanies = companies.map(company => {
      if (company.id === companyId) {
        const updatedSheets = company.sheets.map(sheet =>
          sheet.id === updatedSheet.id ? updatedSheet : sheet
        );
        return { ...company, sheets: updatedSheets };
      }
      return company;
    });
    // Update the companies data in the parent.
    onUpdateCompanies(updatedCompanies);
  };

  // Delete a specific sheet from a company.
  const handleDeleteSheet = (companyId, sheetId) => {
    const updatedCompanies = companies.map(company => {
      if (company.id === companyId) {
        return { ...company, sheets: company.sheets.filter(sheet => sheet.id !== sheetId) };
      }
      return company;
    });
    onUpdateCompanies(updatedCompanies);
  };

  // Handlers for adding previous or next sheets.
  const handleAddPreviousSheet = (companyId, year) => {
    console.log("Add previous sheet for company", companyId, "for year", year);
    // Your implementation here: e.g., add a new sheet object to the corresponding company.
  };

  const handleAddNextSheet = (companyId, year) => {
    console.log("Add next sheet for company", companyId, "for year", year);
    // Your implementation here: e.g., add a new sheet object to the corresponding company.
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Balance Sheets</h2>
      {/* Loop over companies */}
      {companies.map(company => (
        <div key={company.id} style={{ marginBottom: '2rem' }}>
          <h3>{company.name}</h3>
          {/* Loop over each balance sheet form for the company */}
          {company.sheets.map(sheet => (
            <BalanceSheetForm
              key={sheet.id}
              sheet={sheet}
              onUpdate={updatedSheet => handleUpdateSheet(company.id, updatedSheet)}
              validationErrors={[]} // Pass validation errors if any.
              onDelete={() => handleDeleteSheet(company.id, sheet.id)}
              onAddPrevious={year => handleAddPreviousSheet(company.id, year)}
              onAddNext={year => handleAddNextSheet(company.id, year)}
            />
          ))}
        </div>
      ))}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          onClick={handleNext}
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default BalanceSheetsPage;
