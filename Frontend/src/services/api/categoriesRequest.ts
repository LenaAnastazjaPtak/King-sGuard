import axios from "axios";
import { getBackendURL } from "../../utils";
const BACKEND_URL = getBackendURL();

export const getCategoriesRequest = async () => {
  const response = await axios
    .get(`${BACKEND_URL}/api/groups`)
    .catch((error) => {
      console.error("Error fetching data: ", error);
      return error;
    });

  return response.data;
};

export const addCategoryRequest = async (title: string, email: string) => {
  const response = await axios
    .post(`${BACKEND_URL}/api/groups`, { title, email })
    .catch((error) => {
      console.error("Error adding category: ", error.response.data);
      return error.response;
    });

  return response.data;
};
