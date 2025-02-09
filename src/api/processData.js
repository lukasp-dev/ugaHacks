export const processFinancialData = async (data) => {
    try {
      const response = await api.post("/process-data", data);
      return response.data;
    } catch (error) {
      console.error("❌ Error processing financial data:", error.response?.data || error.message);
      throw error;
    }
  };
