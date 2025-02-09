import React, { useState, useRef } from 'react';
import merge from 'lodash.merge';
import EditableField from './EditableField';
import Dropdown from './Dropdown';
import { sumValues } from '../utils/balanceSheetUtils';

const BalanceSheetForm = ({
  sheet,
  onUpdate,
  validationErrors,
  onDelete,
  onAddPrevious,
  onAddNext,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const fileInputRef = useRef();

  // File upload and drag-and-drop handlers:
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log('Dropped files:', files);
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropAreaClick = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  const handleFileInputChange = async (e) => {
    const files = e.target.files;
    console.log('Selected files:', files);
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Step 1: Upload the file (adjust the URL as needed)
      const uploadResponse = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();
      console.log("Upload result:", uploadData);

      if (!uploadData.fileUrl) {
        console.error("File upload failed.");
        return;
      }

      // Step 2: Analyze the file using its URL
      const analysisResponse = await fetch("http://localhost:8080/api/analyzeFileUrl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: uploadData.fileUrl }),
      });
      const analysisData = await analysisResponse.json();
      console.log("Analysis result:", analysisData);

      // Step 3: Merge the returned data into the current sheet
      if (analysisData && analysisData.balanceSheetData) {
        const newData = analysisData.balanceSheetData;
        const updatedSheet = merge({}, sheet, newData);
        updatedSheet.identifier = `${updatedSheet.name}-${updatedSheet.year}`;
        console.log("Merged balance sheet object:", updatedSheet);
        onUpdate(updatedSheet);
      }
    } catch (err) {
      console.error("Error during file upload or analysis:", err);
    }
  };

  // Update a specific field in the balance sheet
  const updateField = (section, subSection, field, newValue) => {
    const updatedSheet = { ...sheet };
    updatedSheet[section][subSection] = {
      ...updatedSheet[section][subSection],
      [field]: newValue,
    };
    onUpdate(updatedSheet);
  };

  const toggleCollapse = () => setCollapsed(!collapsed);

  // Calculate totals for assets, liabilities, and equity
  const totalAssets =
    sumValues(sheet.assets.current) + sumValues(sheet.assets.nonCurrent);
  const totalLiabilities =
    sumValues(sheet.liabilities.current) + sumValues(sheet.liabilities.longTerm);
  const totalEquity =
    sumValues(sheet.equity.common) + sumValues(sheet.equity.comprehensive);
  const overallBalance = totalAssets - totalLiabilities - totalEquity;

  // Validate the accounting equation
  const isEquationValid = totalAssets === (totalLiabilities + totalEquity);

  const hasError = (id) =>
    validationErrors && validationErrors.includes(id);

  return (
    <div className={`balance-sheet ${collapsed ? 'collapsed' : ''}`}>
      {/* Editable Field for Year (instead of Company Name) */}
      <div className="sheet-year">
        <label>Year:</label>
        <EditableField
          value={sheet.year}
          onChange={(newYear) => {
            const updatedSheet = { 
              ...sheet, 
              year: Number(newYear), 
              identifier: `${sheet.name}-${newYear}`
            };
            console.log("Updated sheet year:", updatedSheet);
            onUpdate(updatedSheet);
          }}
          inputType="year"
          fieldId={`sheet-${sheet.id}.year`}
        />
      </div>
      {/* Card Header showing the balance sheet – clicking it toggles collapse */}
      <div className="card-header" onClick={toggleCollapse}>
        <h3>
          Balance Sheet – {sheet.year}
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
      <div className="content" onClick={(e) => e.stopPropagation()}>
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
        {/* Overall Balance & Equation Warning */}
        <div className="balance-separator">
          <div
            style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: isEquationValid ? 'inherit' : 'red',
            }}
          >
            Balance: ${overallBalance.toLocaleString()}
          </div>
          {!isEquationValid && (
            <div className="balance-warning" style={{ color: 'red', fontWeight: 'bold' }}>
              Warning: The balance sheet equation is not satisfied (Assets ≠ Liabilities + Equity)
            </div>
          )}
        </div>
        {/* Extra Sections */}
        <div className="extra-sections">
          <div className="extra-section">
            <label>Income:</label>
            <EditableField
              value={sheet.income}
              onChange={(newVal) => onUpdate({ ...sheet, income: newVal })}
              fieldId={`sheet-${sheet.id}.income`}
              inputType="number"
              error={hasError(`sheet-${sheet.id}.income`)}
            />
          </div>
          <div className="extra-section">
            <label>Revenue:</label>
            <EditableField
              value={sheet.revenue}
              onChange={(newVal) => onUpdate({ ...sheet, revenue: newVal })}
              fieldId={`sheet-${sheet.id}.revenue`}
              inputType="number"
              error={hasError(`sheet-${sheet.id}.revenue`)}
            />
          </div>
          <div className="extra-section">
            <label>Profit:</label>
            <EditableField
              value={sheet.profit}
              onChange={(newVal) => onUpdate({ ...sheet, profit: newVal })}
              fieldId={`sheet-${sheet.id}.profit`}
              inputType="number"
              error={hasError(`sheet-${sheet.id}.profit`)}
            />
          </div>
          <div className="extra-section">
            <label>Operating Income:</label>
            <EditableField
              value={sheet.operatingIncome}
              onChange={(newVal) => onUpdate({ ...sheet, operatingIncome: newVal })}
              fieldId={`sheet-${sheet.id}.operatingIncome`}
              inputType="number"
              error={hasError(`sheet-${sheet.id}.operatingIncome`)}
            />
          </div>
          <div className="extra-section">
            <label>Net Income:</label>
            <EditableField
              value={sheet.netIncome}
              onChange={(newVal) => onUpdate({ ...sheet, netIncome: newVal })}
              fieldId={`sheet-${sheet.id}.netIncome`}
              inputType="number"
              error={hasError(`sheet-${sheet.id}.netIncome`)}
            />
          </div>
          <div className="extra-section">
            <label>Interest Expense:</label>
            <EditableField
              value={sheet.interestExpense}
              onChange={(newVal) => onUpdate({ ...sheet, interestExpense: newVal })}
              fieldId={`sheet-${sheet.id}.interestExpense`}
              inputType="number"
              error={hasError(`sheet-${sheet.id}.interestExpense`)}
            />
          </div>
          <div className="extra-section">
            <label>Income Taxes:</label>
            <EditableField
              value={sheet.incomeTaxes}
              onChange={(newVal) => onUpdate({ ...sheet, incomeTaxes: newVal })}
              fieldId={`sheet-${sheet.id}.incomeTaxes`}
              inputType="number"
              error={hasError(`sheet-${sheet.id}.incomeTaxes`)}
            />
          </div>
          <div className="extra-section">
            <label>Depreciation:</label>
            <EditableField
              value={sheet.depreciation}
              onChange={(newVal) => onUpdate({ ...sheet, depreciation: newVal })}
              fieldId={`sheet-${sheet.id}.depreciation`}
              inputType="number"
              error={hasError(`sheet-${sheet.id}.depreciation`)}
            />
          </div>
          <div className="extra-section">
            <label>Amortization:</label>
            <EditableField
              value={sheet.amortization}
              onChange={(newVal) => onUpdate({ ...sheet, amortization: newVal })}
              fieldId={`sheet-${sheet.id}.amortization`}
              inputType="number"
              error={hasError(`sheet-${sheet.id}.amortization`)}
            />
          </div>
        </div>
      </div>
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
