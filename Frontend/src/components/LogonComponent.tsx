import { createRef, useState } from "react";
import CustomSwitch from "./CustomSwitch";
import ReCAPTCHA from "react-google-recaptcha";

import { Button, TextField, FormControl, Paper } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";

import { isEmailValid, PUBLIC_KEY_PEM } from "../utils";
import { useSnackbar } from "../context/SnackbarContext";
import {
  loginUserRequest,
  registerUserRequest,
} from "../services/api/userRequest";

import "./tmp.css";
import { generateSalt, hashPasswordWithSalt } from "../crypt";
import { saltRequest } from "../services/api/saltRequest";
// type Props = {}

interface ErrorInterface {
  email: string;
  password: string;
  passwordConfirmation: string;
  captcha: string;
}

const INITIAL_ERROR_STATE: ErrorInterface = {
  email: "",
  password: "",
  passwordConfirmation: "",
  captcha: "",
};

const LogonComponent = () => {
  // const captchaRef = createRef<ReCAPTCHA>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("login");
  const [error, setError] = useState<ErrorInterface>(INITIAL_ERROR_STATE);
  const [isProceedingRequest, setIsProceedingRequest] =
    useState<boolean>(false);
  const OPTIONS = ["login", "register"];
  const { openSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const handleChangeSelectedOption = (option: string) => {
    setSelectedOption(option);
    setError(INITIAL_ERROR_STATE);
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
  };

  const handleChangeEmail = (value: string) => {
    setEmail(value);
    setError({
      ...error,
      email: value === "" ? "Email Cannot Be Empty" : "",
    });
  };

  const handleChangePassword = (value: string) => {
    setPassword(value);
    setError({
      ...error,
      password: value === "" ? "Password Cannot Be Empty" : "",
    });
  };

  const handleChangePasswordConfirmation = (value: string) => {
    setPasswordConfirmation(value);
    setError({
      ...error,
      passwordConfirmation:
        value === "" ? "Password Confirmation Cannot Be Empty" : "",
    });
  };

  const handleLogin = async () => {
    try {
      console.log("login");
      setIsProceedingRequest(true);
      let newError = { ...error };
      // const captchaValue = captchaRef.current?.getValue();
      const captchaValue = true;

      if (email === "") newError.email = "Email Cannot Be Empty";
      if (password === "") newError.password = "Password Cannot Be Empty";

      setError(newError);

      if (!captchaValue) {
        console.error("Please complete the captcha");
        console.error(captchaValue);
      }

      if (email === "" || password === "" || !captchaValue) throw new Error();

      setError(INITIAL_ERROR_STATE);

      const saltResponse = await saltRequest(email);
      console.log(saltResponse);

      if (!saltResponse) throw new Error("SALT REQUEST FAILED");

      console.log("SALT REQUEST DONE");

      const hashedPassword = hashPasswordWithSalt(password, saltResponse.salt);
      const loginRequestResponse = await loginUserRequest(
        email,
        hashedPassword
      );

      console.log(loginRequestResponse);

      if (loginRequestResponse) {
        console.log("LOGIN SUCCESS");
        navigate("/home");
        return;
      }

      throw new Error("LOGIN FAILED");
    } catch (e) {
      console.error(e);
      setIsProceedingRequest(false);
    }
  };

  const handleRegister = async () => {
    try {
      console.log("register");
      setIsProceedingRequest(true);
      const newError = { ...error };
      const isEmailValidTested = isEmailValid(email);
      // const captchaValue = captchaRef.current?.getValue();
      const captchaValue = true;

      if (email === "") newError.email = "Email Cannot Be Empty";
      else if (!isEmailValidTested) newError.email = "Invalid Email Format";

      if (password === "") newError.password = "Password Cannot Be Empty";

      if (passwordConfirmation === "")
        newError.passwordConfirmation = "Password Confirmation Cannot Be Empty";

      if (password !== passwordConfirmation)
        newError.passwordConfirmation = "Passwords Do Not Match";

      setError(newError);

      if (!captchaValue) {
        console.error("Please complete the captcha");
        console.error(captchaValue);
      }

      if (
        email === "" ||
        !isEmailValidTested ||
        password === "" ||
        passwordConfirmation === "" ||
        password !== passwordConfirmation ||
        !captchaValue
      )
        throw new Error();

      setError(INITIAL_ERROR_STATE);

      console.log("register error checking done");

      const salt = generateSalt();
      const hashedPassword = hashPasswordWithSalt(password, salt);

      const registerRequestResponse = await registerUserRequest(
        email,
        hashedPassword,
        salt,
        PUBLIC_KEY_PEM
      );
      console.log(registerRequestResponse);

      if (registerRequestResponse) {
        console.log("REGISTER SUCCESS");
        navigate("/home");
        return;
      }

      throw new Error("REGISTER FAILED");
    } catch (e) {
      console.error(e);
      setIsProceedingRequest(false);
    }
  };

  const handleSubmit = () => {
    // if (selectedOption === "login") handleLogin();
    // else handleRegister();
    openSnackbar("This is a test message", "success");
  };

  return (
    <Paper
      sx={{
        maxWidth: "500px",
        width: "450px",
        height: "510px",
        boxSizing: "border-box",
      }}
    >
      <FormControl
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          padding: "2rem",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <CustomSwitch
          options={OPTIONS}
          selected={selectedOption}
          setSelected={handleChangeSelectedOption}
        />
        <TextField
          label="email"
          placeholder="Your email"
          color="secondary"
          value={email}
          error={error.email !== ""}
          helperText={error.email}
          onChange={(e) => handleChangeEmail(e.target.value)}
          fullWidth
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          placeholder="Your Password"
          value={password}
          error={error.password !== ""}
          helperText={error.password}
          color="secondary"
          onChange={(e) => handleChangePassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        {selectedOption === "register" && (
          <TextField
            fullWidth
            label="Password Confirmation"
            type="password"
            color="secondary"
            error={error.passwordConfirmation !== ""}
            placeholder="Password Confirmation"
            value={passwordConfirmation}
            helperText={error.passwordConfirmation}
            onChange={(e) => handleChangePasswordConfirmation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        )}
        {/* <ReCAPTCHA
          sitekey={import.meta.env.VITE_SITE_KEY}
          ref={captchaRef}
          isolated={true}
        /> */}
        {!isProceedingRequest ? (
          <Button
            onClick={handleSubmit}
            sx={{ marginTop: "auto", height: "2.5rem" }}
            fullWidth
            variant="contained"
            color="secondary"
          >
            {selectedOption}
          </Button>
        ) : (
          <LoadingButton
            sx={{ marginTop: "auto", height: "2.5rem" }}
            fullWidth
            variant="contained"
            color="secondary"
            loading
          />
        )}
      </FormControl>
    </Paper>
  );
};

export default LogonComponent;
