import api from "./axiosInstance";
import { setFinancialData } from "./financialDataSlice";
import { store } from "./store";

export const processFinancialData = async (data) => {
  try {
    const response = await api.post("/process-data", data);

    // Redux Store에 저장
    store.dispatch(setFinancialData(response.data));

    return response.data;
  } catch (error) {
    console.error("❌ Error processing financial data:", error.response?.data || error.message);
    throw error;
  }
};
