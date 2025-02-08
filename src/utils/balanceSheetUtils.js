// src/utils/balanceSheetUtils.js
export const defaultBalanceSheet = (id, year) => ({
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
  
  export const sumValues = (obj) =>
    Object.values(obj).reduce((sum, val) => sum + Number(val), 0);
  