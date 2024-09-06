import axios from "axios";
import { getBackendURL } from "../../utils";
const BACKEND_URL = getBackendURL();

export const saltRequest = async (email: string) => {
  const response = await axios
    .post(`${BACKEND_URL}/api/salt`, {
      email: email,
    })
    .catch((error) => {
      return error.response;
    });

  return response.data;
};
