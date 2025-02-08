import api from "./axiosInstance";

// feth all the problems
export const fetchProblems = async () => {
  try {
    const response = await api.get("/problems");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching problems:", error);
    return [];
  }
};

// fetch a problem by id
export const fetchProblemById = async (id) => {
  try {
    const response = await api.get(`/problems/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching problem with ID ${id}:`, error);
    return null;
  }
};

