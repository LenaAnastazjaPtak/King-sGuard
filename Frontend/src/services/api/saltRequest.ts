import axios from "axios";

export const saltRequest = async (email: string) => {
  const response = await axios.get("http://localhost:8000/api/salt/email", {
    params: {
      email: email,
    },
  });

  return response.data;
};
