import axios from "axios";

export const registerUserRequest = async (
  email: string,
  password: string,
  salt: string,
  publicKey: string
) => {
  const response = await axios
    .post("http://localhost:8000/api/users/create", {
      email: email,
      password: password,
      salt: salt,
      roles: ["ROLE_USER"],
      public_key: publicKey,
    })
    .catch((error) => {
      console.error(error.response);
      return error.response;
    });

  return response.data;
};

export const loginUserRequest = async (email: string, password: string) => {
  const response = await axios
    .post("http://localhost:8000/login", {
      email: email,
      password: password,
    })
    .catch((error) => {
      console.error(error.response);
      return error.response;
    });

  return response.data;
};
