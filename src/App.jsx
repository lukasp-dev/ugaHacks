// src/App.jsx
import React, { useState, useRef } from 'react';
import BalanceSheetForm from './components/BalanceSheetForm';
import ValidationModal from './components/ValidationModal';
import { defaultBalanceSheet } from './utils/balanceSheetUtils';
import TruistLogo from './assets/truist-logo.png';
import LoginPage from './components/LoginPage';

const App = () => {
  // =============================
  // ALWAYS DECLARE ALL HOOKS AT TOP LEVEL
  // =============================

  // Login/User State
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState({});

  // Company & Balance Sheet State
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Company A",
      sheets: [defaultBalanceSheet(1, new Date().getFullYear())]
    }
  ]);
  const [currentCompanyId, setCurrentCompanyId] = useState(1);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const tempErrorsRef = useRef([]);

  // For inline editing of company names
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [editingCompanyName, setEditingCompanyName] = useState("");

  // =============================
  // STYLE OBJECTS (Make sure these are defined)
  // =============================
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
    backgroundColor: '#D6EAF8',
    color: '#154360'
  };

  const nextBtnStyle = {
    ...btnStyle,
    backgroundColor: '#D5F5E3',
    color: '#1E8449'
  };

  // =============================
  // HANDLER FUNCTIONS
  // =============================

  // Login and signup handlers
  const handleLogin = (username, password) => {
    if (users[username] && users[username] === password) {
      setCurrentUser(username);
    } else {
      alert("Invalid username or password");
    }
  };

  const handleSignUp = (username, password) => {
    if (users[username]) {
      alert("Username already exists");
    } else {
      setUsers(prev => ({ ...prev, [username]: password }));
      setCurrentUser(username);
    }
  };

  // Get the currently selected company
  const currentCompany = companies.find(company => company.id === currentCompanyId);

  // --- Balance Sheet Functions ---
  const updateSheet = (updatedSheet) => {
    const duplicateExists = currentCompany.sheets.some(
      sheet => sheet.id !== updatedSheet.id && Number(sheet.year) === Number(updatedSheet.year)
    );
    if (duplicateExists) {
      setValidationErrors(prev => [...new Set([...prev, `sheet-${updatedSheet.id}.year`])]);
      alert("Balance sheet for year " + updatedSheet.year + " already exists.");
      return;
    } else {
      setValidationErrors(prev => prev.filter(errorId => errorId !== `sheet-${updatedSheet.id}.year`));
    }
    setCompanies(prev =>
      prev.map(company => {
        if (company.id === currentCompanyId) {
          const updatedSheets = company.sheets.map(sheet =>
            sheet.id === updatedSheet.id ? updatedSheet : sheet
          );
          updatedSheets.sort((a, b) => a.year - b.year);
          return { ...company, sheets: updatedSheets };
        }
        return company;
      })
    );
  };

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

  const addNextSheetFor = (year) => {
    const newYear = year + 1;
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

  const deleteSheet = (sheetId) => {
    setCompanies(prev => prev.map(company => {
      if (company.id === currentCompanyId) {
        return { ...company, sheets: company.sheets.filter(sheet => sheet.id !== sheetId) };
      }
      return company;
    }));
  };

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

  // --- Validation ---
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

  // --- Bottom Button Handlers ---
  const handleAddCompany = () => {
    validateAndProceed(() => {
      if (companies.length >= 5) {
        alert("Maximum of 5 companies allowed.");
        return;
      }
      const newCompanyId = companies.length ? Math.max(...companies.map(c => c.id)) + 1 : 1;
      const newCompanyName = "Company " + String.fromCharCode(64 + companies.length + 1);
      const newCompany = {
        id: newCompanyId,
        name: newCompanyName,
        sheets: [defaultBalanceSheet(1, new Date().getFullYear())]
      };
      setCompanies(prev => [...prev, newCompany]);
      setCurrentCompanyId(newCompanyId);
    });
  };

  // When NEXT is clicked, send data to backend then navigate to /visualization
  const handleCompareData = () => {
    validateAndProceed(() => {
      (async () => {
        const payload = {
          username: currentUser,
          companies, // All companies and their balance sheets
        };
        try {
          const response = await fetch('/api/saveData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            alert('Error saving data.');
            return;
          }
          window.location.href = '/visualization';
        } catch (error) {
          console.error(error);
          alert('Error saving data.');
        }
      })();
    });
  };

  // --- Modal Handlers ---
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

  // =============================
  // RENDER: Conditionally show LoginPage or the main UI.
  // Because all hooks are declared at the top, the hook order is always consistent.
  // =============================
  return (
    <>
      { !currentUser ? (
        <LoginPage onLogin={handleLogin} onSignUp={handleSignUp} />
      ) : (
        <>
          {/* Top Header */}
          <header className="header">
            <span className="disco-emoji" role="img" aria-label="Disco Ball">🪩</span>
            <h1>Balance Sheet Breakdown</h1>
          </header>

          {/* Subheader with Logo, Navigation, and Logged-in Username */}
          <div
            className="subheader"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="logo" style={{ marginRight: '1rem' }}>
                <img src={TruistLogo} alt="Truist Logo" style={{ height: '50px' }} />
              </div>
              <div className="nav-buttons">
                <button>Sheets</button>
                <button>Visualization</button>
                <button>Summary</button>
              </div>
            </div>
            <div style={{ marginRight: '1.5rem', fontWeight: 'bold' }}>
              Logged in as: {currentUser}
            </div>
          </div>

          {/* Company Header */}
          <div className="company-header">
            <h2>{currentCompany.name}</h2>
          </div>

          {/* Company Navigation with Editable Company Names */}
          <div
            className="company-nav-container"
            style={{ margin: '0 auto', marginBottom: '1rem', maxWidth: '900px' }}
          >
            {companies.map(company => (
              <div key={company.id} style={{ marginBottom: '0.5rem' }}>
                {editingCompanyId === company.id ? (
                  <input
                    value={editingCompanyName}
                    onChange={e => setEditingCompanyName(e.target.value)}
                    onBlur={() => {
                      setCompanies(prev =>
                        prev.map(c =>
                          c.id === company.id ? { ...c, name: editingCompanyName } : c
                        )
                      );
                      setEditingCompanyId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setCompanies(prev =>
                          prev.map(c =>
                            c.id === company.id ? { ...c, name: editingCompanyName } : c
                          )
                        );
                        setEditingCompanyId(null);
                      }
                    }}
                    style={company.id === currentCompanyId ? activeCompanyNavBtnStyle : companyNavBtnStyle}
                    autoFocus
                  />
                ) : (
                  <button
                    style={company.id === currentCompanyId ? activeCompanyNavBtnStyle : companyNavBtnStyle}
                    onClick={() => setCurrentCompanyId(company.id)}
                    onDoubleClick={() => {
                      setEditingCompanyId(company.id);
                      setEditingCompanyName(company.name);
                    }}
                  >
                    {company.name}
                  </button>
                )}
              </div>
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
                <button className="btn-compare-data" style={nextBtnStyle} onClick={handleCompareData}>
                  NEXT
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
      )}
    </>
  );
};

export default App;
