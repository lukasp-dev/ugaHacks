// File: src/components/BalanceSheetForm.jsx
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
      {/* Editable Field for Company Name */}
      <div className="company-name">
        <label>Company Name:</label>
        <EditableField
          value={sheet.name}
          onChange={(newName) => {
            const updatedSheet = { 
              ...sheet, 
              name: newName, 
              identifier: `${newName}-${sheet.year}` 
            };
            console.log("Updated company name:", updatedSheet);
            onUpdate(updatedSheet);
          }}
          fieldId={`sheet-${sheet.id}.name`}
        />
      </div>
      {/* Card Header showing the identifier */}
      <div className="card-header" onClick={toggleCollapse}>
        <h3>
          Balance Sheet – {sheet.identifier || `${sheet.name}-${sheet.year}`}
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
              error={hasError(`sheet-${sheet.id}.income`)}
            />
          </div>
          {/* (Other extra sections go here) */}
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
