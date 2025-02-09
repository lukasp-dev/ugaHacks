import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

// colors
const colors = [
  "rgba(75, 192, 192, 0.7)", "rgba(255, 99, 132, 0.7)", "rgba(54, 162, 235, 0.7)",
  "rgba(255, 206, 86, 0.7)", "rgba(153, 102, 255, 0.7)", "rgba(255, 159, 64, 0.7)", "rgba(144, 238, 144, 0.7)"
];

// sample data
const companies = [
  {
    name: "Company A",
    balanceSheet: {
      years: ["2020", "2021", "2022", "2023"],
      categories: ["Current Assets", "Inventories", "Non-Current Assets", "Current Liabilities", "Non-Current Liabilities", "Common Stock", "Retained Earnings"],
      values: {
        "Current Assets": [50000, 55000, 60000, 65000],
        "Inventories": [1234, 1234, 1234, 1234],
        "Non-Current Assets": [100000, 105000, 110000, 115000],
        "Current Liabilities": [30000, 32000, 34000, 36000],
        "Non-Current Liabilities": [50000, 52000, 54000, 56000],
        "Common Stock": [70000, 75000, 80000, 85000],
        "Retained Earnings": [40000, 45000, 50000, 55000]
      }
    },
    incomeStatement: {
      years: ["2020", "2021", "2022", "2023"],
      categories: ["Net Income", "Cost", "Revenue", "Interest Expenses", "Income Taxes", "Depreciation", "Amortization"],
      values: {
        "Net Income": [50000, 55000, 60000, 65000],
        "Cost": [32345, 32345, 32345, 32345],
        "Revenue": [50000, 22222, 33333, 44444],
        "Interest Expenses": [10000, 15000, 25000, 35000],
        "Income Taxes": [100000, 105000, 110000, 115000],
        "Depreciation": [30000, 32000, 34000, 36000],
        "Amortization": [50000, 52000, 54000, 56000]
      }
    }
  },
  {
    name: "Company B",
    balanceSheet: {
      years: ["2020", "2021", "2022", "2023"],
      categories: ["Current Assets", "Inventories", "Non-Current Assets", "Current Liabilities", "Non-Current Liabilities", "Common Stock", "Retained Earnings"],
      values: {
        "Current Assets": [60000, 65000, 70000, 75000],
        "Inventories": [1234, 1234, 1234, 1234],
        "Non-Current Assets": [110000, 115000, 120000, 125000],
        "Current Liabilities": [35000, 37000, 39000, 41000],
        "Non-Current Liabilities": [55000, 57000, 59000, 61000],
        "Common Stock": [75000, 80000, 85000, 90000],
        "Retained Earnings": [45000, 50000, 55000, 60000]
      }
    },
    incomeStatement: {
      years: ["2020", "2021", "2022", "2023"],
      categories: ["Net Income", "Cost", "Revenue", "Interest Expenses", "Income Taxes", "Depreciation", "Amortization"],
      values: {
        "Net Income": [60000, 65000, 70000, 75000],
        "Cost": [40000, 42000, 44000, 46000],
        "Revenue": [55000, 25000, 35000, 45000],
        "Interest Expenses": [12000, 18000, 27000, 38000],
        "Income Taxes": [110000, 115000, 120000, 125000],
        "Depreciation": [32000, 34000, 36000, 38000],
        "Amortization": [52000, 54000, 56000, 58000]
      }
    }
  }
];

const generateCompDatasets = (companies, category, type) => {
  return companies.map((company, index) => ({
    label: `${company.name} - ${category}`,
    data: company[type].values[category],
    backgroundColor: colors[index % colors.length],
    borderColor: colors[index % colors.length],
    borderWidth: 2,
    fill: false
  }));
};

const generateFinDatasets = (company, type) => {
  return company[type].categories.map((category, index) => ({
    label: category,
    data: company[type].values[category],
    backgroundColor: colors[index % colors.length],
    borderColor: colors[index % colors.length],
    borderWidth: 2,
    fill: false
  }));
};

function calculateFinancialRatios(companies) {
  return companies.map(company => {
    const balanceSheet = company.balanceSheet.values;
    const incomeStatement = company.incomeStatement.values;

    return {
      name: company.name,
      ratios: {
        currentRatio: balanceSheet["Current Assets"].map((_, i) =>
          balanceSheet["Current Assets"][i] / balanceSheet["Current Liabilities"][i]
        ),
        quickRatio: balanceSheet["Current Assets"].map((_, i) =>
          (balanceSheet["Current Assets"][i] - balanceSheet["Inventories"][i]) / balanceSheet["Current Liabilities"][i]
        ),
        debtRatio: balanceSheet["Current Liabilities"].map((_, i) =>
          (balanceSheet["Current Liabilities"][i] + balanceSheet["Non-Current Liabilities"][i]) /
          (balanceSheet["Current Assets"][i] + balanceSheet["Non-Current Assets"][i])
        ),
        debtEquityRatio: balanceSheet["Current Liabilities"].map((_, i) =>
          (balanceSheet["Current Liabilities"][i] + balanceSheet["Non-Current Liabilities"][i]) /
          (balanceSheet["Common Stock"][i] + balanceSheet["Retained Earnings"][i])
        ),
        netProfitMargin: incomeStatement["Revenue"].map((_, i) =>
          (incomeStatement["Revenue"][i] - incomeStatement["Cost"][i]) / incomeStatement["Revenue"][i]
        ),
        roa: incomeStatement["Net Income"].map((_, i) =>
          incomeStatement["Net Income"][i] /
          (balanceSheet["Current Assets"][i] + balanceSheet["Non-Current Assets"][i])
        ),
        ebitdaMargin: incomeStatement["Revenue"].map((_, i) =>
          (incomeStatement["Net Income"][i] + incomeStatement["Interest Expenses"][i] +
            incomeStatement["Income Taxes"][i] + incomeStatement["Depreciation"][i] +
            incomeStatement["Amortization"][i]) / incomeStatement["Revenue"][i]
        )
      }
    };
  });
};

function calculateEbitda(companies) {
  return companies.map(company => {
    const incomeStatement = company.incomeStatement.values;

    return {
      name: company.name,
      formula: "EBITDA = Net Income + Interest Expenses + Income Taxes + Depreciation + Amortization",
      ebitda: incomeStatement["Revenue"].map((_, i) =>
        incomeStatement["Net Income"][i] +
        incomeStatement["Interest Expenses"][i] +
        incomeStatement["Income Taxes"][i] +
        incomeStatement["Depreciation"][i] +
        incomeStatement["Amortization"][i]
      )
    };
  });
}


const formatLabel = (label) => {
  return label
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^./, (str) => str.toUpperCase());
};

const VisualizationPage = () => {
  const balanceCompRef = useRef(null);
  const incomeCompRef = useRef(null);
  const balanceFinRef = useRef(null);
  const incomeFinRef = useRef(null);
  const balanceCompRefL = useRef(null);
  const incomeCompRefL = useRef(null);
  const finRatioRef = useRef(null);
  const canvasRef = useRef(null);
  const ebitdaRef = useRef(null);
  const ebitdaCanvasRef = useRef(null);

  const [balanceCategory, setBalanceCategory] = useState("Current Assets");
  const [incomeCategory, setIncomeCategory] = useState("Net Income");
  const [selectedCompany1, setSelectedCompany1] = useState(companies[0]);
  const [selectedCompany2, setSelectedCompany2] = useState(companies[0]);
  const [balanceCategoryL, setBalanceCategoryL] = useState("Current Assets");
  const [incomeCategoryL, setIncomeCategoryL] = useState("Net Income");
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [selectedCompany3, setSelectedCompany3] = useState(companies[0]);
  const [financialRatios, setFinancialRatios] = useState([]);
  const [ebitdaData, setEbitdaData] = useState([]);


  useEffect(() => {
    setFinancialRatios(calculateFinancialRatios(companies));
  }, []);

  useEffect(() => {
    setEbitdaData(calculateEbitda(companies));
  }, []);

  useEffect(() => {
    if (balanceCompRef.current) balanceCompRef.current.destroy();

    const ctxBalance = document.getElementById("balanceComparisonChart").getContext("2d");
    balanceCompRef.current = new Chart(ctxBalance, {
      type: "bar",
      data: {
        labels: companies[0].balanceSheet.years,
        datasets: generateCompDatasets(companies, balanceCategory, "balanceSheet")
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
  }, [balanceCategory]);

  useEffect(() => {
    if (incomeCompRef.current) incomeCompRef.current.destroy();

    const ctxIncome = document.getElementById("incomeComparisonChart").getContext("2d");
    incomeCompRef.current = new Chart(ctxIncome, {
      type: "bar",
      data: {
        labels: companies[0].incomeStatement.years,
        datasets: generateCompDatasets(companies, incomeCategory, "incomeStatement")
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
  }, [incomeCategory]);

  useEffect(() => {
    if (balanceFinRef.current) balanceFinRef.current.destroy();

    const ctxBalanceFin = document.getElementById("balanceFinChart").getContext("2d");
    balanceFinRef.current = new Chart(ctxBalanceFin, {
      type: "bar",
      data: {
        labels: companies[0].incomeStatement.years,
        datasets: generateFinDatasets(selectedCompany1, "balanceSheet")
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
  }, [selectedCompany1]);

  useEffect(() => {
    if (incomeFinRef.current) incomeFinRef.current.destroy();

    const ctxIncomeFin = document.getElementById("incomeFinChart").getContext("2d");
    incomeFinRef.current = new Chart(ctxIncomeFin, {
      type: "bar",
      data: {
        labels: companies[0].incomeStatement.years,
        datasets: generateFinDatasets(selectedCompany2, "incomeStatement")
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
  }, [selectedCompany2]);

  useEffect(() => {
    if (balanceCompRefL.current) balanceCompRefL.current.destroy();

    const ctxBalanceL = document.getElementById("balanceComparisonChartL").getContext("2d");
    balanceCompRefL.current = new Chart(ctxBalanceL, {
      type: "line",
      data: {
        labels: companies[0].balanceSheet.years,
        datasets: generateCompDatasets(companies, balanceCategoryL, "balanceSheet")
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
  }, [balanceCategoryL]);

  useEffect(() => {
    if (incomeCompRefL.current) incomeCompRefL.current.destroy();

    const ctxIncomeL = document.getElementById("incomeComparisonChartL").getContext("2d");
    incomeCompRefL.current = new Chart(ctxIncomeL, {
      type: "line",
      data: {
        labels: companies[0].incomeStatement.years,
        datasets: generateCompDatasets(companies, incomeCategoryL, "incomeStatement")
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
  }, [incomeCategoryL]);

  useEffect(() => {
    if (!canvasRef.current || financialRatios.length === 0) return;

    const selectedCompanyRatios = financialRatios.find(c => c.name === selectedCompany.name);
    if (!selectedCompanyRatios) return;

    const ctx = canvasRef.current.getContext("2d");
    if (finRatioRef.current) finRatioRef.current.destroy();

    const datasets = Object.keys(selectedCompanyRatios.ratios).map((ratioKey, index) => ({
      label: formatLabel(ratioKey),
      data: selectedCompanyRatios.ratios[ratioKey],
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length],
      borderWidth: 2,
      fill: false
    }));

    finRatioRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: selectedCompany.balanceSheet.years,
        datasets: datasets
      },
      options: { responsive: true, scales: { y: { beginAtZero: false } } }
    });
  }, [selectedCompany, financialRatios]);

  useEffect(() => {
    if (!ebitdaCanvasRef.current || ebitdaData.length === 0) return;
  
    const selectedCompanyEbitda = ebitdaData.find(c => c.name === selectedCompany3.name);
    if (!selectedCompanyEbitda) return;
  
    const ctx = ebitdaCanvasRef.current.getContext("2d");
    if (ebitdaRef.current) ebitdaRef.current.destroy();
  
    ebitdaRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: selectedCompany3.balanceSheet.years,
        datasets: [{
          label: "EBITDA",
          data: selectedCompanyEbitda.ebitda,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderWidth: 2,
          fill: true
        }]
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
  }, [selectedCompany3, ebitdaData]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Visualization</h2>

      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ flex: 1 }}>
          <h3>Balance Sheet Comparison (Bar Chart)</h3>
          <select value={balanceCategory} onChange={(e) => setBalanceCategory(e.target.value)}>
            {companies[0].balanceSheet.categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <canvas id="balanceComparisonChart"></canvas>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Income Statement Comparison (Bar Chart)</h3>
          <select value={incomeCategory} onChange={(e) => setIncomeCategory(e.target.value)}>
            {companies[0].incomeStatement.categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <canvas id="incomeComparisonChart"></canvas>
        </div>
      </div>

      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ flex: 1 }}>
          <h3>Balance Sheet Financial Data (Bar Chart)</h3>
          <select value={selectedCompany1.name} onChange={(e) => setSelectedCompany1(companies.find(c => c.name === e.target.value))}>
            {companies.map((company, index) => (
              <option key={index} value={company.name}>{company.name}</option>
            ))}
          </select>
          <canvas id="balanceFinChart"></canvas>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Income Statement Financial Data (Bar Chart)</h3>
          <select value={selectedCompany2.name} onChange={(e) => setSelectedCompany2(companies.find(c => c.name === e.target.value))}>
            {companies.map((company, index) => (
              <option key={index} value={company.name}>{company.name}</option>
            ))}
          </select>
          <canvas id="incomeFinChart"></canvas>
        </div>
      </div>

      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ flex: 1 }}>
          <h3>Balance Sheet Comparison (Line Chart)</h3>
          <select value={balanceCategoryL} onChange={(e) => setBalanceCategoryL(e.target.value)}>
            {companies[0].balanceSheet.categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <canvas id="balanceComparisonChartL"></canvas>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Income Statement Comparison (Line Chart)</h3>
          <select value={incomeCategoryL} onChange={(e) => setIncomeCategoryL(e.target.value)}>
            {companies[0].incomeStatement.categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <canvas id="incomeComparisonChartL"></canvas>
        </div>
      </div>

      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ flex: 1 }}>
          <h3>Financial Ratios</h3>
          <select value={selectedCompany.name} onChange={(e) => setSelectedCompany(companies.find(c => c.name === e.target.value))}>
            {companies.map((company, index) => (
              <option key={index} value={company.name}>{company.name}</option>
            ))}
          </select>
          <canvas ref={canvasRef}></canvas>
        </div>
        <div style={{ flex: 1 }}>
          <h3>EBITDA</h3>
          <select value={selectedCompany3.name} onChange={(e) => setSelectedCompany3(companies.find(c => c.name === e.target.value))}>
            {companies.map((company, index) => (
              <option key={index} value={company.name}>{company.name}</option>
            ))}
          </select>
          <canvas ref={ebitdaCanvasRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default VisualizationPage;
