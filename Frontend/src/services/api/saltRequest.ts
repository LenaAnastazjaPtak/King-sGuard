import axios from "axios";

export const saltRequest = async (email: string) => {
  const response = await axios
    .post("http://localhost:8000/api/salt", {
      email: email,
    })
    .catch((error) => {
      return error.response;
    });

  return response.data;
};
