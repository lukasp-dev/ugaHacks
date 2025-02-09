// src/utils/balanceSheetUtils.js
export const defaultBalanceSheet = (id, year, name = '') => ({
  id: `sheet-${id}`,
  name, // New field for the company name
  year,
  // Identifier is computed by concatenating name and year. If name is empty, just use the year.
  identifier: name ? `${name}-${year}` : `${year}`,
  assets: {
    current: {
      "Cash and cash equivalents": 0,
      "Receivables, net": 0, // Note: Our default uses this key, but GPT returns "Accounts receivable, net"
      "Inventories": 0,
      "Etc.": 0,
    },
    nonCurrent: {
      "Property and equipment, net": 0,
      "Goodwill": 0,
      "Long-term lease assets": 0,
      "Etc.": 0,
    },
  },
  liabilities: {
    current: {
      "Short-term borrowings": 0,
      "Accounts payable": 0,
      "Accrued liabilities": 0,
      "Deferred revenue": 0,
      "Commercial paper": 0,
      "Term debt": 0,
      "Etc.": 0,
    },
    longTerm: {
      "Long-term debt": 0,
      "Deferred income taxes": 0,
      "Finance & operating lease obligations": 0,
      "Etc.": 0,
    },
  },
  equity: {
    common: {
      "Common stock": 0,
      "Capital in excess of par value": 0,
      "Retained earnings": 0,
      "Etc.": 0,
    },
    comprehensive: {
      "Foreign currency translation adjustments": 0,
      "Unrealized gains/losses on securities": 0,
      "Etc.": 0,
    },
  },
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
