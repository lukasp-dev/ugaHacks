// src/components/BalanceSheetForm.jsx
import React, { useState, useRef } from 'react';
import EditableField from './EditableField';
import Dropdown from './Dropdown'; // Updated import to match filename
import { sumValues } from '../utils/balanceSheetUtils';

const BalanceSheetForm = ({
  sheet,
  onUpdate,
  validationErrors,
  onDelete,
  onAddPrevious, // For adding a previous year
  onAddNext,     // For adding a next year
}) => {
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

  const hasError = (id) =>
    validationErrors && validationErrors.includes(id);

  return (
    <div className={`balance-sheet ${collapsed ? 'collapsed' : ''}`}>
      {/* Previous Year Button */}
      <button
        className="add-year-button previous"
        onClick={(e) => {
          e.stopPropagation();
          onAddPrevious(sheet.year);
        }}
        title="Add balance sheet for the previous year"
      >
        +
      </button>
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
        <i className={`fa ${collapsed ? 'fa-chevron-down' : 'fa-chevron-up'}`} />
      </div>
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
        {/* Extra Sections */}
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
          <div className="extra-section">
            <label>Operating Income:</label>
            <EditableField
              value={sheet.operatingIncome}
              onChange={(newVal) => onUpdate({ ...sheet, operatingIncome: newVal })}
              fieldId={`sheet-${sheet.id}.operatingIncome`}
              error={hasError(`sheet-${sheet.id}.operatingIncome`)}
            />
          </div>
          <div className="extra-section">
            <label>Net Income:</label>
            <EditableField
              value={sheet.netIncome}
              onChange={(newVal) => onUpdate({ ...sheet, netIncome: newVal })}
              fieldId={`sheet-${sheet.id}.netIncome`}
              error={hasError(`sheet-${sheet.id}.netIncome`)}
            />
          </div>
          <div className="extra-section">
            <label>Interest Expense:</label>
            <EditableField
              value={sheet.interestExpense}
              onChange={(newVal) => onUpdate({ ...sheet, interestExpense: newVal })}
              fieldId={`sheet-${sheet.id}.interestExpense`}
              error={hasError(`sheet-${sheet.id}.interestExpense`)}
            />
          </div>
          <div className="extra-section">
            <label>Income Taxes:</label>
            <EditableField
              value={sheet.incomeTaxes}
              onChange={(newVal) => onUpdate({ ...sheet, incomeTaxes: newVal })}
              fieldId={`sheet-${sheet.id}.incomeTaxes`}
              error={hasError(`sheet-${sheet.id}.incomeTaxes`)}
            />
          </div>
          <div className="extra-section">
            <label>Depreciation:</label>
            <EditableField
              value={sheet.depreciation}
              onChange={(newVal) => onUpdate({ ...sheet, depreciation: newVal })}
              fieldId={`sheet-${sheet.id}.depreciation`}
              error={hasError(`sheet-${sheet.id}.depreciation`)}
            />
          </div>
          <div className="extra-section">
            <label>Amortization:</label>
            <EditableField
              value={sheet.amortization}
              onChange={(newVal) => onUpdate({ ...sheet, amortization: newVal })}
              fieldId={`sheet-${sheet.id}.amortization`}
              error={hasError(`sheet-${sheet.id}.amortization`)}
            />
          </div>
        </div>
      </div>
      {/* Next Year Button */}
      <button
        className="add-year-button next"
        onClick={(e) => {
          e.stopPropagation();
          onAddNext(sheet.year);
        }}
        title="Add balance sheet for the next year"
      >
        +
      </button>
    </div>
  );
};

export default BalanceSheetForm;
