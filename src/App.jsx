// src/App.jsx
import React, { useState, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import BalanceSheetForm from './components/BalanceSheetForm';
import ValidationModal from './components/ValidationModal';
import { defaultBalanceSheet } from './utils/balanceSheetUtils';
import TruistLogo from './assets/truist-logo.png';
import LoginPage from './components/LoginPage';
import VisualizationPage from './components/VisualizationPage';
import SummaryPage from './components/SummaryPage';
import LandingScreen from './components/LandingScreen';
import GameScreen from './components/GameScreen';
import GameProgress from './components/GameProgress';
import GamePlay from './components/GamePlay2';
import GameEnd from './components/GameEnd';

//
// APP LAYOUT (HEADER & SUBHEADER)
//
const AppLayout = ({ currentUser, visualizationAccessible, summaryAccessible }) => {
  const location = useLocation();

  // Determine which section we’re in based on the pathname
  const isAnalysis =
    location.pathname.startsWith('/sheets') ||
    location.pathname.startsWith('/visualization') ||
    location.pathname.startsWith('/summary');
  const isLanding = location.pathname === '/home';
  const isGame = location.pathname.startsWith('/game');

  // Set header title based on current route
  let headerTitle = "";
  if (isAnalysis) {
    headerTitle = "Balance Sheet Breakdown";
  } else if (isLanding) {
    headerTitle = "Menu";
  } else if (isGame) {
    headerTitle = "Game";
  } else {
    headerTitle = "Balance Sheet Breakdown";
  }

  // Define button styles for enabled and disabled nav buttons
  const enabledButtonStyle = {
    background: 'var(--truist-purple)',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '5px',
    cursor: 'pointer'
  };
  const disabledButtonStyle = {
    background: '#ccc',
    color: '#666',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '5px',
    cursor: 'not-allowed'
  };

  // Render nav buttons only when in Analysis or Game sections.
  let navContent = null;
  if (isAnalysis) {
    navContent = (
      <div className="nav-buttons" style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/sheets" style={{ textDecoration: 'none' }}>
          <button style={enabledButtonStyle}>Balance Sheets</button>
        </Link>
        {visualizationAccessible ? (
          <Link to="/visualization" style={{ textDecoration: 'none' }}>
            <button style={enabledButtonStyle}>Visualization</button>
          </Link>
        ) : (
          <button style={disabledButtonStyle} disabled>
            Visualization
          </button>
        )}
        {summaryAccessible ? (
          <Link to="/summary" style={{ textDecoration: 'none' }}>
            <button style={enabledButtonStyle}>Summary</button>
          </Link>
        ) : (
          <button style={disabledButtonStyle} disabled>
            Summary
          </button>
        )}
      </div>
    );
  } else if (isGame) {
    navContent = (
      <div className="nav-buttons" style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/game/progress" style={{ textDecoration: 'none' }}>
          <button style={enabledButtonStyle}>Progress</button>
        </Link>
        <Link to="/game/play" style={{ textDecoration: 'none' }}>
          <button style={enabledButtonStyle}>Play</button>
        </Link>
      </div>
    );
  }
  
  return (
    <>
      {/* Top Header */}
      <header className="header" style={{ display: 'flex', alignItems: 'center', padding: '0.3rem 1.5rem', backgroundColor: 'var(--truist-purple)', color: '#fff' }}>
        <span className="disco-emoji" role="img" aria-label="Disco Ball" style={{ fontSize: '1.6rem', marginRight: '0.7rem' }}>
          🪩
        </span>
        <h1 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 'bold' }}>{headerTitle}</h1>
      </header>
      
      {/* Subheader */}
      <div
        className="subheader"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          borderBottom: '1px solid var(--truist-border)',
          padding: '0.8rem 1.5rem'
        }}
      >
        {/* Left group: Logo and nav buttons */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/home">
            <div
              className="logo"
              style={{
                width: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginRight: '1rem'
              }}
            >
              <img
                src={TruistLogo}
                alt="Truist Logo"
                style={{ maxHeight: '50px', objectFit: 'contain', display: 'block' }}
              />
            </div>
          </Link>
          <div style={{ marginLeft: '1rem' }}>
            {navContent}
          </div>
        </div>
        {/* Right group: Logged-in info */}
        <div style={{ fontWeight: 'bold', marginRight: '1.5rem' }}>
          Logged in as: {currentUser}
        </div>
      </div>
      <Outlet />
    </>
  );
};

//
// MAIN APP COMPONENT
//
const App = () => {
  // ------------------------------
  // LOGIN / USER STATE
  // ------------------------------
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState({});

  // ------------------------------
  // COMPANY & BALANCE SHEET STATE
  // ------------------------------
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Company A",
      sheets: [defaultBalanceSheet(1, new Date().getFullYear())],
    },
  ]);
  const [currentCompanyId, setCurrentCompanyId] = useState(1);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const tempErrorsRef = useRef([]);

  // For inline editing of company names
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [editingCompanyName, setEditingCompanyName] = useState("");

  // ------------------------------
  // NAVIGATION / VISUALIZATION ACCESS STATE
  // ------------------------------
  const [visualizationAccessible, setVisualizationAccessible] = useState(false);
  const [summaryAccessible, setSummaryAccessible] = useState(false);

  // ------------------------------
  // HANDLER FUNCTIONS
  // ------------------------------
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
      setUsers((prev) => ({ ...prev, [username]: password }));
      setCurrentUser(username);
    }
  };

  // Get the currently selected company
  const currentCompany = companies.find((company) => company.id === currentCompanyId);

  // --- Balance Sheet Functions ---
  const updateSheet = (updatedSheet) => {
    const duplicateExists = currentCompany.sheets.some(
      (sheet) =>
        sheet.id !== updatedSheet.id && Number(sheet.year) === Number(updatedSheet.year)
    );
    if (duplicateExists) {
      setValidationErrors((prev) => [...new Set([...prev, `sheet-${updatedSheet.id}.year`])]);
      alert("Balance sheet for year " + updatedSheet.year + " already exists.");
      return;
    } else {
      setValidationErrors((prev) =>
        prev.filter((errorId) => errorId !== `sheet-${updatedSheet.id}.year`)
      );
    }
    setCompanies((prev) =>
      prev.map((company) => {
        if (company.id === currentCompanyId) {
          const updatedSheets = company.sheets.map((sheet) =>
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
    setCompanies((prev) =>
      prev.map((company) => {
        if (company.id === currentCompanyId) {
          if (company.sheets.length >= 10) {
            alert("Maximum of 10 balance sheets allowed for this company.");
            return company;
          }
          const newId = company.sheets.length
            ? Math.max(...company.sheets.map((s) => s.id)) + 1
            : 1;
          const newYear = company.sheets.length
            ? Math.max(...company.sheets.map((s) => s.year)) + 1
            : new Date().getFullYear();
          const newSheet = defaultBalanceSheet(newId, newYear);
          const updatedSheets = [...company.sheets, newSheet];
          updatedSheets.sort((a, b) => a.year - b.year);
          return { ...company, sheets: updatedSheets };
        }
        return company;
      })
    );
  };

  const addNextSheetFor = (year) => {
    const newYear = year + 1;
    const currentCompany = companies.find((company) => company.id === currentCompanyId);
    if (currentCompany.sheets.length >= 10) {
      alert("Maximum of 10 balance sheets allowed for this company.");
      return;
    }
    if (currentCompany.sheets.some((s) => s.year === newYear)) {
      alert("Balance sheet for year " + newYear + " already exists.");
      return;
    }
    const newId = currentCompany.sheets.length
      ? Math.max(...currentCompany.sheets.map((s) => s.id)) + 1
      : 1;
    const newSheet = defaultBalanceSheet(newId, newYear);
    const updatedSheets = [...currentCompany.sheets, newSheet];
    updatedSheets.sort((a, b) => a.year - b.year);
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === currentCompanyId ? { ...company, sheets: updatedSheets } : company
      )
    );
  };

  const deleteSheet = (sheetId) => {
    setCompanies((prev) =>
      prev.map((company) => {
        if (company.id === currentCompanyId) {
          return { ...company, sheets: company.sheets.filter((sheet) => sheet.id !== sheetId) };
        }
        return company;
      })
    );
  };

  const addPreviousSheet = (year) => {
    const newYear = year - 1;
    const currentCompany = companies.find((company) => company.id === currentCompanyId);
    if (currentCompany.sheets.length >= 10) {
      alert("Maximum of 10 balance sheets allowed for this company.");
      return;
    }
    if (currentCompany.sheets.some((s) => s.year === newYear)) {
      alert("Balance sheet for year " + newYear + " already exists.");
      return;
    }
    const newId = currentCompany.sheets.length
      ? Math.max(...currentCompany.sheets.map((s) => s.id)) + 1
      : 1;
    const newSheet = defaultBalanceSheet(newId, newYear);
    const updatedSheets = [...currentCompany.sheets, newSheet];
    updatedSheets.sort((a, b) => a.year - b.year);
    setCompanies((prev) =>
      prev.map((company) =>
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
    // Note: sheet.openingIncome is not defined in defaultBalanceSheet so this check will be skipped.
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
    currentCompany.sheets.forEach((sheet) => {
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

  const handleAddCompany = () => {
    validateAndProceed(() => {
      if (companies.length >= 5) {
        alert("Maximum of 5 companies allowed.");
        return;
      }
      const newCompanyId = companies.length ? Math.max(...companies.map((c) => c.id)) + 1 : 1;
      const newCompanyName = "Company " + String.fromCharCode(64 + companies.length + 1);
      const newCompany = {
        id: newCompanyId,
        name: newCompanyName,
        sheets: [defaultBalanceSheet(1, new Date().getFullYear())],
      };
      setCompanies((prev) => [...prev, newCompany]);
      setCurrentCompanyId(newCompanyId);
    });
  };

  const handleModalCancel = () => {
    const errorFieldIds = tempErrorsRef.current.map((err) => err.fieldId);
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

  // ------------------------------
  // SheetsPage Component (for /sheets route)
  // ------------------------------
  const SheetsPage = () => {
    const navigate = useNavigate();

    const handleNextAndCompare = () => {
      validateAndProceed(() => {
        // Enable navigation to Visualization (unlock Visualization button)
        setVisualizationAccessible(true);
        navigate('/visualization');
      });
    };

    return (
      <>
        {/* Company Header */}
        <div className="company-header">
          <h2>{currentCompany.name}</h2>
        </div>

        {/* Company Navigation with Editable Company Names */}
        <div
          className="company-nav-container"
          style={{ margin: '0 auto', marginBottom: '1rem', maxWidth: '900px' }}
        >
          {companies.map((company) => (
            <div key={company.id} style={{ marginBottom: '0.5rem' }}>
              {editingCompanyId === company.id ? (
                <input
                  value={editingCompanyName}
                  onChange={(e) => setEditingCompanyName(e.target.value)}
                  onBlur={() => {
                    setCompanies((prev) =>
                      prev.map((c) =>
                        c.id === company.id ? { ...c, name: editingCompanyName } : c
                      )
                    );
                    setEditingCompanyId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setCompanies((prev) =>
                        prev.map((c) =>
                          c.id === company.id ? { ...c, name: editingCompanyName } : c
                        )
                      );
                      setEditingCompanyId(null);
                    }
                  }}
                  style={
                    company.id === currentCompanyId
                      ? { padding: '0.5rem 1rem', backgroundColor: '#EBF5FB', border: '1px solid #AED6F1', fontWeight: 'bold', width: '100%', textAlign: 'left', marginBottom: '0.5rem' }
                      : { padding: '0.5rem 1rem', backgroundColor: '#F8F9F9', border: '1px solid #ccc', width: '100%', textAlign: 'left', marginBottom: '0.5rem' }
                  }
                  autoFocus
                />
              ) : (
                <button
                  style={
                    company.id === currentCompanyId
                      ? { padding: '0.5rem 1rem', backgroundColor: '#EBF5FB', border: '1px solid #AED6F1', fontWeight: 'bold', width: '100%', textAlign: 'left', marginBottom: '0.5rem' }
                      : { padding: '0.5rem 1rem', backgroundColor: '#F8F9F9', border: '1px solid #ccc', width: '100%', textAlign: 'left', marginBottom: '0.5rem' }
                  }
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
              currentCompany.sheets.map((sheet) => (
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
                <button className="empty-add-year-button" onClick={addNextSheet}>
                  +
                </button>
              </div>
            )}

            {/* Bottom Buttons */}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              {companies.length < 5 && (
                <button
                  className="btn-add-company"
                  style={{ padding: '0.75rem 1.5rem', backgroundColor: '#D6EAF8', color: '#154360', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', margin: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                  onClick={handleAddCompany}
                >
                  ADD COMPANY
                </button>
              )}
              <button className="btn-compare-data" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#D5F5E3', color: '#1E8449', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', margin: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} onClick={handleNextAndCompare}>
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
    );
  };

  // ------------------------------
  // MAIN RENDER
  // ------------------------------
  return (
    <>
      {!currentUser ? (
        <LoginPage onLogin={handleLogin} onSignUp={handleSignUp} />
      ) : (
        <Router>
          <Routes>
            <Route
              element={
                <AppLayout
                  currentUser={currentUser}
                  visualizationAccessible={visualizationAccessible}
                  summaryAccessible={summaryAccessible}
                />
              }
            >
              <Route path="/home" element={<LandingScreen />} />
              <Route path="/sheets" element={<SheetsPage />} />
              <Route
                path="/visualization"
                element={
                  visualizationAccessible ? (
                    <VisualizationPage onNext={() => { setSummaryAccessible(true); }} />
                  ) : (
                    <Navigate to="/sheets" replace />
                  )
                }
              />
              <Route
                path="/summary"
                element={
                  summaryAccessible ? (
                    <SummaryPage />
                  ) : (
                    <Navigate to="/sheets" replace />
                  )
                }
              />
              <Route path="/game/*" element={<GameScreen />}>
                <Route path="progress" element={<GameProgress />} />
                <Route path="play" element={<GamePlay />} />
                <Route index element={<GamePlay />} />
              </Route>
              <Route path="/" element={<Navigate to="/home" replace />} />
            </Route>
          </Routes>
        </Router>
      )}
    </>
  );
};

export default App;
