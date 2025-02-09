// src/utils/sheetHelpers.js

export const getAllBalanceSheets = (companies) => {
  console.log("getAllBalanceSheets called with companies:", companies);
  
  const flatSheets = companies.flatMap(company =>
    company.sheets.map(sheet => ({
      ...sheet,
      companyId: company.id,
      companyName: company.name,
    }))
  );
  
  console.log("getAllBalanceSheets returning flatSheets:", flatSheets);
  return flatSheets;
};
