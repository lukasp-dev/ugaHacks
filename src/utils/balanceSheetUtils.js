// src/utils/balanceSheetUtils.js
export const defaultBalanceSheet = (id, year) => ({
  id,
  year,
  assets: {
    current: {
      "Cash and cash equivalents": 0,
      "Receivables, net": 0,
      "Inventories": 0,
      // Removed "Prepaid expenses & other" to avoid redundancy.
      "Etc.": 0, // Extra row for any other current assets.
    },
    nonCurrent: {
      "Property and equipment, net": 0,
      "Goodwill": 0,
      "Long-term lease assets": 0,
      "Etc.": 0, // Extra row for any other non-current assets.
    },
  },
  liabilities: {
    current: {
      "Short-term borrowings": 0,
      "Accounts payable": 0,
      "Accrued liabilities": 0,
      "Etc.": 0, // Extra row for any other current liabilities.
    },
    longTerm: {
      "Long-term debt": 0,
      "Deferred income taxes": 0,
      "Finance & operating lease obligations": 0,
      "Etc.": 0, // Extra row for any other long-term liabilities.
    },
  },
  equity: {
    common: {
      "Common stock": 0,
      "Capital in excess of par value": 0,
      "Retained earnings": 0,
      "Etc.": 0, // Extra row for any other common equity items.
    },
    comprehensive: {
      "Foreign currency translation adjustments": 0,
      "Unrealized gains/losses on securities": 0,
      "Etc.": 0, // Extra row for any other comprehensive equity items.
    },
  },
  // Extra sections
  income: 0,
  revenue: 0,
  profit: 0,
  operatingIncome: 0,
  netIncome: 0,
  interestExpense: 0,
  incomeTaxes: 0,
  depreciation: 0,
  amortization: 0,
});

export const sumValues = (obj) =>
  Object.values(obj).reduce((sum, val) => sum + Number(val), 0);
