import axios from "axios";
import { getBackendURL } from "../../utils";
const BACKEND_URL = getBackendURL();
// /api/credentials
export const addNewPasswordRequest = async (
  website: string,
  password: string,
  username: string,
  userId: string,
  category: null | string,
  email: string,
  title: string
) => {
  const response = await axios
    .post(`${BACKEND_URL}/api/credentials`, {
      website,
      password,
      username,
      userId,
      category,
      email,
      title,
    })
    .catch((error) => {
      console.error(error.response);
      return error.response;
    });

  return response.data;
};

export const getPasswordsRequest = async (email: string) => {
  const response = await axios
    .get(`${BACKEND_URL}/api/credentials/`, {
      email,
    })
    .catch((error) => {
      console.error(error.response);
      return error.response;
    });

  return response.data;
};
