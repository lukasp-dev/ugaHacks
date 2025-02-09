// src/utils/sheetHelpers.js

export const getAllBalanceSheets = (companies) => {
    // Using flatMap to iterate over each company and then over each of its sheets.
    return companies.flatMap(company =>
      company.sheets.map(sheet => ({
        ...sheet,
        companyId: company.id,
        companyName: company.name,
      }))
    );
  };
  