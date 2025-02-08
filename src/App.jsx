// src/App.jsx
import React, { useState, useRef } from 'react';
import BalanceSheetForm from './components/BalanceSheetForm';
import ValidationModal from './components/ValidationModal';
import { defaultBalanceSheet } from './utils/balanceSheetUtils';
import TruistLogo from './assets/truist-logo.png';

const App = () => {
  // Each company has an id, a name (e.g., "Company A") and an array of balance sheets.
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Company A",
      sheets: [defaultBalanceSheet(1, new Date().getFullYear())]
    }
  ]);
  // Tracks which company page is currently visible.
  const [currentCompanyId, setCurrentCompanyId] = useState(1);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const tempErrorsRef = useRef([]);

  // Find the company currently being viewed.
  const currentCompany = companies.find(company => company.id === currentCompanyId);

  // --------------------------------------------------
  // Balance Sheet (Year) Functions for the current company
  // --------------------------------------------------

  // Update one balance sheet in the current company.
  const updateSheet = (updatedSheet) => {
    // Check if the new year is already in use (by a different sheet)
    const duplicateExists = currentCompany.sheets.some(
      sheet => sheet.id !== updatedSheet.id && Number(sheet.year) === Number(updatedSheet.year)
    );
    
    if (duplicateExists) {
      // Mark the year field as having an error so that the UI can display an error message.
      setValidationErrors(prev => [...new Set([...prev, `sheet-${updatedSheet.id}.year`])]);
      // Optionally, also alert the user:
      alert("Balance sheet for year " + updatedSheet.year + " already exists.");
      // Do not update the sheet’s year if duplicate exists.
      return;
    } else {
      // Remove any previous duplicate–year error for this sheet’s year field
      setValidationErrors(prev => prev.filter(errorId => errorId !== `sheet-${updatedSheet.id}.year`));
    }
    
    // Update the current company’s sheets with the new year value
    setCompanies(prev =>
      prev.map(company => {
        if (company.id === currentCompanyId) {
          const updatedSheets = company.sheets.map(sheet =>
            sheet.id === updatedSheet.id ? updatedSheet : sheet
          );
          // Sort the sheets by year after update
          updatedSheets.sort((a, b) => a.year - b.year);
          return { ...company, sheets: updatedSheets };
        }
        return company;
      })
    );
  };

  // (Existing addNextSheet – not used by the form buttons directly)
  const addNextSheet = () => {
    setCompanies(prev => prev.map(company => {
      if (company.id === currentCompanyId) {
        if (company.sheets.length >= 10) {
          alert("Maximum of 10 balance sheets allowed for this company.");
          return company;
        }
        const newId = company.sheets.length
          ? Math.max(...company.sheets.map(s => s.id)) + 1
          : 1;
        const newYear = company.sheets.length
          ? Math.max(...company.sheets.map(s => s.year)) + 1
          : new Date().getFullYear();
        const newSheet = defaultBalanceSheet(newId, newYear);
        const updatedSheets = [...company.sheets, newSheet];
        updatedSheets.sort((a, b) => a.year - b.year);
        return { ...company, sheets: updatedSheets };
      }
      return company;
    }));
  };

  // Add a next-year balance sheet for a given sheet (based on its year).
  const addNextSheetFor = (year) => {
    const newYear = year + 1;
    // Get the current company object from state.
    const currentCompany = companies.find(company => company.id === currentCompanyId);
    
    if (currentCompany.sheets.length >= 10) {
      alert("Maximum of 10 balance sheets allowed for this company.");
      return;
    }
    if (currentCompany.sheets.some(s => s.year === newYear)) {
      alert("Balance sheet for year " + newYear + " already exists.");
      return;
    }
    
    const newId = currentCompany.sheets.length
      ? Math.max(...currentCompany.sheets.map(s => s.id)) + 1
      : 1;
    const newSheet = defaultBalanceSheet(newId, newYear);
    const updatedSheets = [...currentCompany.sheets, newSheet];
    updatedSheets.sort((a, b) => a.year - b.year);
    
    setCompanies(prev =>
      prev.map(company =>
        company.id === currentCompanyId ? { ...company, sheets: updatedSheets } : company
      )
    );
  };

  // Delete a balance sheet from the current company.
  const deleteSheet = (sheetId) => {
    setCompanies(prev => prev.map(company => {
      if (company.id === currentCompanyId) {
        return { ...company, sheets: company.sheets.filter(sheet => sheet.id !== sheetId) };
      }
      return company;
    }));
  };

  // Add a previous-year balance sheet (used by the BalanceSheetForm’s plus button).
  const addPreviousSheet = (year) => {
    const newYear = year - 1;
    const currentCompany = companies.find(company => company.id === currentCompanyId);
    
    if (currentCompany.sheets.length >= 10) {
      alert("Maximum of 10 balance sheets allowed for this company.");
      return;
    }
    if (currentCompany.sheets.some(s => s.year === newYear)) {
      alert("Balance sheet for year " + newYear + " already exists.");
      return;
    }
    
    const newId = currentCompany.sheets.length
      ? Math.max(...currentCompany.sheets.map(s => s.id)) + 1
      : 1;
    const newSheet = defaultBalanceSheet(newId, newYear);
    const updatedSheets = [...currentCompany.sheets, newSheet];
    updatedSheets.sort((a, b) => a.year - b.year);
    
    setCompanies(prev =>
      prev.map(company =>
        company.id === currentCompanyId ? { ...company, sheets: updatedSheets } : company
      )
    );
  };

  // --------------------------------------------------
  // Validation
  // --------------------------------------------------

  // Check a single sheet for any fields that are 0.
  const findZeroFields = (sheet) => {
    const errors = [];
    if (Number(sheet.year) === 0) {
      errors.push({
        sheetId: sheet.id,
        sheetYear: sheet.year,
        location: 'Year',
        fieldId: `sheet-${sheet.id}.year`,
      });
    }
    const checkNested = (obj, location) => {
      Object.keys(obj).forEach(key => {
        if (Number(obj[key]) === 0) {
          errors.push({
            sheetId: sheet.id,
            sheetYear: sheet.year,
            location: `${location} > ${key}`,
            fieldId: `sheet-${sheet.id}.${location.replace(/ > /g, '.').toLowerCase()}.${key}`,
          });
        }
      });
    };

    checkNested(sheet.assets.current, 'assets > current');
    checkNested(sheet.assets.nonCurrent, 'assets > nonCurrent');
    checkNested(sheet.liabilities.current, 'liabilities > current');
    checkNested(sheet.liabilities.longTerm, 'liabilities > longTerm');
    checkNested(sheet.equity.common, 'equity > common');
    checkNested(sheet.equity.comprehensive, 'equity > comprehensive');

    if (Number(sheet.income) === 0) {
      errors.push({
        sheetId: sheet.id,
        sheetYear: sheet.year,
        location: 'Income',
        fieldId: `sheet-${sheet.id}.income`,
      });
    }
    if (Number(sheet.revenue) === 0) {
      errors.push({
        sheetId: sheet.id,
        sheetYear: sheet.year,
        location: 'Revenue',
        fieldId: `sheet-${sheet.id}.revenue`,
      });
    }
    if (Number(sheet.profit) === 0) {
      errors.push({
        sheetId: sheet.id,
        sheetYear: sheet.year,
        location: 'Profit',
        fieldId: `sheet-${sheet.id}.profit`,
      });
    }
    if (Number(sheet.openingIncome) === 0) {
      errors.push({
        sheetId: sheet.id,
        sheetYear: sheet.year,
        location: 'Opening Income',
        fieldId: `sheet-${sheet.id}.openingIncome`,
      });
    }
    if (Number(sheet.netIncome) === 0) {
      errors.push({
        sheetId: sheet.id,
        sheetYear: sheet.year,
        location: 'Net Income',
        fieldId: `sheet-${sheet.id}.netIncome`,
      });
    }
    if (Number(sheet.interestExpense) === 0) {
      errors.push({
        sheetId: sheet.id,
        sheetYear: sheet.year,
        location: 'Interest Expense',
        fieldId: `sheet-${sheet.id}.interestExpense`,
      });
    }
    if (Number(sheet.incomeTaxes) === 0) {
      errors.push({
        sheetId: sheet.id,
        sheetYear: sheet.year,
        location: 'Income Taxes',
        fieldId: `sheet-${sheet.id}.incomeTaxes`,
      });
    }
    if (Number(sheet.depreciation) === 0) {
      errors.push({
        sheetId: sheet.id,
        sheetYear: sheet.year,
        location: 'Depreciation',
        fieldId: `sheet-${sheet.id}.depreciation`,
      });
    }
    if (Number(sheet.amortization) === 0) {
      errors.push({
        sheetId: sheet.id,
        sheetYear: sheet.year,
        location: 'Amortization',
        fieldId: `sheet-${sheet.id}.amortization`,
      });
    }
    return errors;
  };

  // Validate the current company's balance sheets. If any 0‑entries exist, show the modal.
  const validateAndProceed = (action) => {
    let allErrors = [];
    currentCompany.sheets.forEach(sheet => {
      const errs = findZeroFields(sheet);
      allErrors = allErrors.concat(errs);
    });
    if (allErrors.length > 0) {
      tempErrorsRef.current = allErrors;
      setPendingAction(() => action);
      setShowModal(true);
    } else {
      action();
    }
  };

  // --------------------------------------------------
  // Bottom Button Handlers (Navigation)
  // --------------------------------------------------

  // ADD COMPANY: add a new company (if < 5 exist) and switch to it.
  const handleAddCompany = () => {
    validateAndProceed(() => {
      if (companies.length >= 5) {
        alert("Maximum of 5 companies allowed.");
        return;
      }
      const newCompanyId = companies.length ? Math.max(...companies.map(c => c.id)) + 1 : 1;
      const newCompanyName = "Company " + String.fromCharCode(64 + companies.length + 1); // A, B, C...
      const newCompany = {
        id: newCompanyId,
        name: newCompanyName,
        sheets: [defaultBalanceSheet(1, new Date().getFullYear())]
      };
      setCompanies(prev => [...prev, newCompany]);
      setCurrentCompanyId(newCompanyId);
    });
  };

  // COMPARE DATA: navigate to the visualization page.
  const handleCompareData = () => {
    validateAndProceed(() => {
      window.location.href = '/visualization';
    });
  };

  // --------------------------------------------------
  // Modal Handlers
  // --------------------------------------------------

  const handleModalCancel = () => {
    const errorFieldIds = tempErrorsRef.current.map(err => err.fieldId);
    setValidationErrors(errorFieldIds);
    setShowModal(false);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  // --------------------------------------------------
  // Styles (using softer color palettes and modern visuals)
  // --------------------------------------------------

  // Bottom button base style.
  const btnStyle = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    margin: '0.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const addCompanyBtnStyle = {
    ...btnStyle,
    backgroundColor: '#D6EAF8', // soft light blue
    color: '#154360'
  };

  const compareDataBtnStyle = {
    ...btnStyle,
    backgroundColor: '#D5F5E3', // soft light green
    color: '#1E8449'
  };

  // Company navigation button styles.
  const companyNavBtnStyle = {
    padding: '0.5rem 1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '0.5rem',
    width: '100%',
    textAlign: 'left',
    backgroundColor: '#F8F9F9',
    cursor: 'pointer'
  };

  const activeCompanyNavBtnStyle = {
    ...companyNavBtnStyle,
    backgroundColor: '#EBF5FB',
    borderColor: '#AED6F1',
    fontWeight: 'bold'
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <>
      {/* Top Header */}
      <header className="header">
        <span className="disco-emoji" role="img" aria-label="Disco Ball">🪩</span>
        <h1>Balance Sheet Breakdown</h1>
      </header>

      {/* Subheader with Logo and Navigation */}
      <div className="subheader" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="logo" style={{ marginRight: '1rem' }}>
          <img src={TruistLogo} alt="Truist Logo" style={{ height: '50px' }} />
        </div>
        <div className="nav-buttons">
          <button>Sheets</button>
          <button>Visualization</button>
          <button>Summary</button>
        </div>
      </div>

      {/* Company Header */}
      <div className="company-header">
        <h2>{currentCompany.name}</h2>
      </div>

      {/* Company Navigation (Centered Above the Forms) */}
      <div className="company-nav-container" style={{ margin: '0 auto', marginBottom: '1rem', maxWidth: '900px' }}>
        {companies.map(company => (
          <button
            key={company.id}
            style={company.id === currentCompanyId ? activeCompanyNavBtnStyle : companyNavBtnStyle}
            onClick={() => setCurrentCompanyId(company.id)}
          >
            {company.name}
          </button>
        ))}
      </div>

      {/* Company Content */}
      <section className="company-content">
        <div className="container">
          {currentCompany.sheets.length > 0 ? (
            currentCompany.sheets.map(sheet => (
                <BalanceSheetForm
                  key={`${currentCompany.id}-${sheet.id}`}
                  sheet={sheet}
                  onUpdate={updateSheet}
                  validationErrors={validationErrors}
                  onDelete={deleteSheet}
                  onAddPrevious={addPreviousSheet}
                  onAddNext={addNextSheetFor}
                />
              ))
          ) : (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button className="empty-add-year-button" onClick={addNextSheet}>+</button>
            </div>
          )}

          {/* Bottom Buttons */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            {companies.length < 5 && (
              <button className="btn-add-company" style={addCompanyBtnStyle} onClick={handleAddCompany}>
                ADD COMPANY
              </button>
            )}
            <button className="btn-compare-data" style={compareDataBtnStyle} onClick={handleCompareData}>
              COMPARE DATA
            </button>
          </div>
        </div>
      </section>

      {showModal && (
        <ValidationModal
          errors={tempErrorsRef.current}
          onCancel={handleModalCancel}
          onConfirm={handleModalConfirm}
        />
      )}
    </>
  );
};

export default App;
