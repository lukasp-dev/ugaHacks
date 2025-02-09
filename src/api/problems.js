import api from "./axiosInstance";

export const getRandomProblems = async (type) => {
  try {
    const response = await api.get(`/problems/random?type=${type}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching problems:", error.response?.data || error.message);
    throw error;
  }
};
