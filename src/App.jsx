// src/App.jsx
import React, { useState, useRef } from 'react';
import BalanceSheetForm from './components/BalanceSheetForm';
import ValidationModal from './components/ValidationModal';
import { defaultBalanceSheet } from './utils/balanceSheetUtils';
import TruistLogo from './assets/truist-logo.png';

const App = () => {
  const [sheets, setSheets] = useState([
    defaultBalanceSheet(1, new Date().getFullYear()),
  ]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const tempErrorsRef = useRef([]);

  // Update a given sheet.
  const updateSheet = (updatedSheet) => {
    setSheets((prev) => {
      const newSheets = prev.map((s) =>
        s.id === updatedSheet.id ? updatedSheet : s
      );
      newSheets.sort((a, b) => a.year - b.year);
      return newSheets;
    });
  };

  // Add a new balance sheet.
  const addSheet = () => {
    setSheets((prev) => {
      const newId = prev.length ? Math.max(...prev.map((s) => s.id)) + 1 : 1;
      const newYear =
        prev.length ? Math.max(...prev.map((s) => s.year)) + 1 : new Date().getFullYear();
      const newSheet = defaultBalanceSheet(newId, newYear);
      const updated = [...prev, newSheet];
      updated.sort((a, b) => a.year - b.year);
      return updated;
    });
  };

  // Delete a balance sheet.
  const deleteSheet = (id) => {
    setSheets((prev) => prev.filter((sheet) => sheet.id !== id));
  };

  // Validate each sheet and find any fields that are still 0.
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
      Object.keys(obj).forEach((key) => {
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
    return errors;
  };

  // NEXT button click handler.
  const handleNext = () => {
    let allErrors = [];
    sheets.forEach((sheet) => {
      const errs = findZeroFields(sheet);
      allErrors = allErrors.concat(errs);
    });
    if (allErrors.length > 0) {
      tempErrorsRef.current = allErrors;
      setShowModal(true);
    } else {
      alert('Proceeding to next step.');
    }
  };

  // Modal Cancel: mark affected fields and close the modal.
  const handleModalCancel = () => {
    const errorFieldIds = tempErrorsRef.current.map((err) => err.fieldId);
    setValidationErrors(errorFieldIds);
    setShowModal(false);
  };

  // Modal Confirm: proceed.
  const handleModalConfirm = () => {
    setShowModal(false);
    alert('Proceeding to next step.');
  };

  return (
    <>
      {/* Top Header */}
      <header className="header">
        <span className="disco-emoji" role="img" aria-label="Disco Ball">
          🪩
        </span>
        <h1>Balance Sheet Breakdown</h1>
      </header>
      {/* Subheader with Logo and Navigation */}
      <div className="subheader">
        <div className="logo">
          <img src={TruistLogo} alt="Truist Logo" />
        </div>
        <div className="nav-buttons">
          <button>Sheets</button>
          <button>Visualization</button>
          <button>Summary</button>
        </div>
      </div>
      {/* Main Container */}
      <div className="container">
        {sheets.length > 0 ? (
          <>
            {sheets.map((sheet) => (
              <div key={sheet.id} style={{ position: 'relative' }}>
                <BalanceSheetForm
                  sheet={sheet}
                  onUpdate={updateSheet}
                  validationErrors={validationErrors}
                  onDelete={deleteSheet}
                />
                {sheet.id === sheets[sheets.length - 1].id && (
                  <button className="add-year-button" onClick={addSheet}>
                    +
                  </button>
                )}
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button className="next-button" onClick={handleNext}>
                NEXT
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button className="empty-add-year-button" onClick={addSheet}>
              +
            </button>
          </div>
        )}
      </div>
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
