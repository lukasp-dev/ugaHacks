import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const useLoginApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const fetchSecuredData = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "openid profile email",
      });

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/authorized`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error("Error fetching secured data:", error);
      return null;
    }
  };

  return { fetchSecuredData };
};

export default useLoginApi;
