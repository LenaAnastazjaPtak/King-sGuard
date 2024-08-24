import axios from "axios";

export const saltRequest = async (email: string) => {
  const response = await axios.post("http://localhost:8000/api/salt", {
    email: email,
  });

  return response.data;
};
