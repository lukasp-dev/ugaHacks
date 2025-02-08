import React, { useState, useRef, useEffect } from 'react';
import './index.css';

// Import the Truist logo (update the path as needed)
import TruistLogo from './assets/truist-logo.png';

// Factory function for a new balance sheet.
const defaultBalanceSheet = (id, year) => ({
  id,
  year,
  assets: {
    current: {
      "Cash and cash equivalents": 0,
      "Receivables, net": 0,
      "Inventories": 0,
      "Prepaid expenses & other": 0,
    },
    nonCurrent: {
      "Property and equipment, net": 0,
      "Goodwill": 0,
      "Long-term lease assets": 0,
    },
  },
  liabilities: {
    current: {
      "Short-term borrowings": 0,
      "Accounts payable": 0,
      "Accrued liabilities": 0,
    },
    longTerm: {
      "Long-term debt": 0,
      "Deferred income taxes": 0,
      "Finance & operating lease obligations": 0,
    },
  },
  equity: {
    common: {
      "Common stock": 0,
      "Capital in excess of par value": 0,
      "Retained earnings": 0,
    },
    comprehensive: {
      "Foreign currency translation adjustments": 0,
      "Unrealized gains/losses on securities": 0,
    },
  },
  // Extra sections
  income: 0,
  revenue: 0,
  profit: 0,
});

// Helper function to sum numeric values in an object.
const sumValues = (obj) =>
  Object.values(obj).reduce((sum, val) => sum + Number(val), 0);

/**
 * EditableField renders a value that can be clicked to edit.
 * If flagged as an error, its background is lightly shaded red.
 */
function EditableField({ value, onChange, isYear, fieldId, error }) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleClick = (e) => {
    e.stopPropagation();
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    onChange(isYear ? parseInt(localValue, 10) : Number(localValue));
  };

  const handleChange = (e) => setLocalValue(e.target.value);

  return editing ? (
    <input
      className={`editable-input ${error ? 'error' : ''}`}
      type="number"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      autoFocus
    />
  ) : (
    <span
      className={`editable-field ${error ? 'error' : ''}`}
      onClick={handleClick}
    >
      {isYear ? localValue : `$${Number(value).toLocaleString()}`}
    </span>
  );
}

/**
 * Dropdown displays a collapsible section (for example, “Current Assets”).
 * It receives the sheetId, section, and subSection (for unique field IDs)
 * and an array of field IDs that are flagged as errors. When any field in
 * this dropdown is flagged, the section auto–opens.
 */
function Dropdown({
  title,
  fields,
  onFieldChange,
  sheetId,
  section,
  subSection,
  validationErrors,
}) {
  const [open, setOpen] = useState(false);

  // Automatically open this dropdown if any field in it is flagged with an error.
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
      <div className="dropdown-header" onClick={toggleOpen}>
        <span className="dropdown-title">{title}</span>
        <span className="dropdown-total">${total.toLocaleString()}</span>
        <span className="dropdown-toggle">{open ? '-' : '+'}</span>
      </div>
      <div className="dropdown-content">
        {Object.keys(fields).map((field, idx) => {
          const fieldId = `sheet-${sheetId}.${section}.${subSection}.${field}`;
          const hasError =
            validationErrors && validationErrors.includes(fieldId);
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
}

/**
 * BalanceSheetForm renders one balance sheet “card” (for one year).
 * It also shows a small delete button in the top–right corner.
 */
function BalanceSheetForm({ sheet, onUpdate, validationErrors, onDelete }) {
  const [collapsed, setCollapsed] = useState(false);
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log('Dropped files:', files);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDropAreaClick = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    console.log('Selected files:', files);
  };

  const updateField = (section, subSection, field, newValue) => {
    const updatedSheet = { ...sheet };
    updatedSheet[section][subSection] = {
      ...updatedSheet[section][subSection],
      [field]: newValue,
    };
    onUpdate(updatedSheet);
  };

  const toggleCollapse = () => setCollapsed(!collapsed);

  const totalAssets =
    sumValues(sheet.assets.current) + sumValues(sheet.assets.nonCurrent);
  const totalLiabilities =
    sumValues(sheet.liabilities.current) + sumValues(sheet.liabilities.longTerm);
  const totalEquity =
    sumValues(sheet.equity.common) + sumValues(sheet.equity.comprehensive);
  const overallBalance = totalAssets - totalLiabilities - totalEquity;

  // Helper to check if a field should be flagged.
  const hasError = (id) =>
    validationErrors && validationErrors.includes(id);

  return (
    <div className={`balance-sheet ${collapsed ? 'collapsed' : ''}`}>
      <div className="card-header" onClick={toggleCollapse}>
        <h3>
          Balance Sheet –{' '}
          <EditableField
            value={sheet.year}
            isYear
            onChange={(newYear) => onUpdate({ ...sheet, year: newYear })}
            fieldId={`sheet-${sheet.id}.year`}
            error={hasError(`sheet-${sheet.id}.year`)}
          />
        </h3>
        <i
          className={`fa ${collapsed ? 'fa-chevron-down' : 'fa-chevron-up'}`}
        />
      </div>
      {/* Delete Button (small trash icon) */}
      <button
        className="delete-sheet-button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(sheet.id);
        }}
        title="Delete this balance sheet"
      >
        <i className="fa fa-trash" />
      </button>
      <div className="content">
        <div
          className="droparea"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleDropAreaClick}
        >
          <i className="fa fa-upload" aria-hidden="true"></i>
          <p>Click or Drag &amp; Drop Files Here</p>
          <input
            type="file"
            id="fileInput"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            multiple
          />
        </div>
        <div className="data-display">
          {/* Assets Section */}
          <div className="assets">
            <div className="section-header">
              Assets
              <span className="section-total">
                ${totalAssets.toLocaleString()}
              </span>
            </div>
            <Dropdown
              title="Current Assets"
              fields={sheet.assets.current}
              onFieldChange={(field, newVal) =>
                updateField('assets', 'current', field, newVal)
              }
              sheetId={sheet.id}
              section="assets"
              subSection="current"
              validationErrors={validationErrors}
            />
            <Dropdown
              title="Non-Current Assets"
              fields={sheet.assets.nonCurrent}
              onFieldChange={(field, newVal) =>
                updateField('assets', 'nonCurrent', field, newVal)
              }
              sheetId={sheet.id}
              section="assets"
              subSection="nonCurrent"
              validationErrors={validationErrors}
            />
          </div>
          {/* Liabilities Section */}
          <div className="liabilities">
            <div className="section-header">
              Liabilities
              <span className="section-total">
                ${totalLiabilities.toLocaleString()}
              </span>
            </div>
            <Dropdown
              title="Current Liabilities"
              fields={sheet.liabilities.current}
              onFieldChange={(field, newVal) =>
                updateField('liabilities', 'current', field, newVal)
              }
              sheetId={sheet.id}
              section="liabilities"
              subSection="current"
              validationErrors={validationErrors}
            />
            <Dropdown
              title="Long-Term Liabilities"
              fields={sheet.liabilities.longTerm}
              onFieldChange={(field, newVal) =>
                updateField('liabilities', 'longTerm', field, newVal)
              }
              sheetId={sheet.id}
              section="liabilities"
              subSection="longTerm"
              validationErrors={validationErrors}
            />
          </div>
          {/* Equity Section */}
          <div className="equity">
            <div className="section-header">
              Equity
              <span className="section-total">
                ${totalEquity.toLocaleString()}
              </span>
            </div>
            <Dropdown
              title="Common Stock & Retained Earnings"
              fields={sheet.equity.common}
              onFieldChange={(field, newVal) =>
                updateField('equity', 'common', field, newVal)
              }
              sheetId={sheet.id}
              section="equity"
              subSection="common"
              validationErrors={validationErrors}
            />
            <Dropdown
              title="Accumulated Other Comprehensive Loss"
              fields={sheet.equity.comprehensive}
              onFieldChange={(field, newVal) =>
                updateField('equity', 'comprehensive', field, newVal)
              }
              sheetId={sheet.id}
              section="equity"
              subSection="comprehensive"
              validationErrors={validationErrors}
            />
          </div>
        </div>
        <div className="balance-separator">
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
            Balance: ${overallBalance.toLocaleString()}
          </div>
        </div>
        {/* Extra Sections: Income, Revenue, Profit */}
        <div className="extra-sections">
          <div className="extra-section">
            <label>Income:</label>
            <EditableField
              value={sheet.income}
              onChange={(newVal) => onUpdate({ ...sheet, income: newVal })}
              fieldId={`sheet-${sheet.id}.income`}
              error={hasError(`sheet-${sheet.id}.income`)}
            />
          </div>
          <div className="extra-section">
            <label>Revenue:</label>
            <EditableField
              value={sheet.revenue}
              onChange={(newVal) => onUpdate({ ...sheet, revenue: newVal })}
              fieldId={`sheet-${sheet.id}.revenue`}
              error={hasError(`sheet-${sheet.id}.revenue`)}
            />
          </div>
          <div className="extra-section">
            <label>Profit:</label>
            <EditableField
              value={sheet.profit}
              onChange={(newVal) => onUpdate({ ...sheet, profit: newVal })}
              fieldId={`sheet-${sheet.id}.profit`}
              error={hasError(`sheet-${sheet.id}.profit`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ValidationModal displays a warning if some fields are 0.
 * The errors are grouped by balance sheet year and displayed as separate rows.
 */
function ValidationModal({ errors, onCancel, onConfirm }) {
  // Group errors by sheetYear so that each balance sheet year appears only once.
  const groupedErrors = {};
  errors.forEach((err) => {
    const sheetYear = err.sheetYear;
    let message;
    if (err.location.includes('>')) {
      const parts = err.location.split('>').map((s) => s.trim());
      let subheading = parts[1];
      // Map the internal names to friendly titles.
      if (parts[0].toLowerCase() === 'assets') {
        if (subheading.toLowerCase() === 'current')
          subheading = 'Current Assets';
        else if (
          subheading.toLowerCase() === 'noncurrent' ||
          subheading.toLowerCase() === 'nonCurrent'
        )
          subheading = 'Non-Current Assets';
      } else if (parts[0].toLowerCase() === 'liabilities') {
        if (subheading.toLowerCase() === 'current')
          subheading = 'Current Liabilities';
        else if (
          subheading.toLowerCase() === 'longterm' ||
          subheading.toLowerCase() === 'longTerm'
        )
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
}

/**
 * Main App component holds the balance sheets, the validation error state,
 * and the modal display state. It also defines functions for adding and deleting
 * sheets, updating sheets, and handling the NEXT button.
 */
export default function App() {
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

  // Add a new sheet (a new year).
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

  // For each sheet, record all fields that are still 0.
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
            fieldId: `sheet-${sheet.id}.${location
              .replace(/ > /g, '.')
              .toLowerCase()}.${key}`,
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

  // When the NEXT button is clicked, check all sheets.
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

  // Modal "Cancel": mark the affected fields and close the modal.
  const handleModalCancel = () => {
    const errorFieldIds = tempErrorsRef.current.map((err) => err.fieldId);
    setValidationErrors(errorFieldIds);
    setShowModal(false);
  };

  // Modal "Next": simply proceed.
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
      {/* Subheader with logo and navigation */}
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
      {/* Main container */}
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
                {/* Only show the add–year plus button on the last sheet */}
                {sheet.id === sheets[sheets.length - 1].id && (
                  <button className="add-year-button" onClick={addSheet}>
                    +
                  </button>
                )}
              </div>
            ))}
            {/* Increased marginTop to move the NEXT button farther away */}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button className="next-button" onClick={handleNext}>
                NEXT
              </button>
            </div>
          </>
        ) : (
          // When there are no sheets, show a centered plus button with improved styling.
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
}
