import { createRef, useEffect, useState } from "react";
import CustomSwitch from "./CustomSwitch";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";

import { Button, TextField, FormControl, Paper } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";

import { isEmailValid, PUBLIC_KEY_PEM } from "../utils";
import {
  loginUserRequest,
  registerUserRequest,
} from "../services/api/userRequest";

import "./tmp.css";
import {
  generateKeyPairFromString,
  generateSalt,
  hashPasswordWithSalt,
} from "../crypt";
import { saltRequest } from "../services/api/saltRequest";
// import { useSnackbar, VariantType } from "notistack";

import useSnackbarHook from "../hooks/useSnackbar";
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
  // const { enqueueSnackbar } = useSnackbar();
  const { snackbarError, snackbarSuccess } = useSnackbarHook();

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

  const handleValidateLogin = (): boolean => {
    const newError = { ...error };
    const captchaValue = true;

    if (email === "") newError.email = "Email Cannot Be Empty";
    if (!isEmailValid(email)) newError.email = "Invalid Email Format";
    if (password === "") newError.password = "Password Cannot Be Empty";
    if (!captchaValue) newError.captcha = "Please complete the captcha";
    setError(newError);

    if (!isEmailValid(email)) {
      snackbarError("Invalid email format");
      return false;
    }

    if (email === "" || password === "") {
      snackbarError("Please fill all fields");
      return false;
    }

    if (!captchaValue) {
      snackbarError("Please complete the captcha");
      return false;
    }

    setError(INITIAL_ERROR_STATE);

    return true;
  };

  const handleValidateRegister = (): boolean => {
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

    if (email === "" || password === "" || passwordConfirmation === "") {
      snackbarError("Please fill all fields");
      return false;
    }

    if (!isEmailValidTested) {
      snackbarError("Invalid email format");
      return false;
    }

    if (password !== passwordConfirmation) {
      snackbarError("Passwords do not match");
      return false;
    }

    if (!captchaValue) {
      snackbarError("Please complete the captcha");
      return false;
    }

    setError(INITIAL_ERROR_STATE);
    return true;
  };

  const handleLogin = async () => {
    const start = performance.now();

    if (!handleValidateLogin()) return;

    const saltResponse = await saltRequest(email);
    if (saltResponse.code === 404) {
      snackbarError("Incorrect email or password");
      return;
    }

    const hashedPassword = hashPasswordWithSalt(password, saltResponse.salt);
    const loginRequestResponse = await loginUserRequest(email, hashedPassword);

    if (loginRequestResponse.code === 401) {
      snackbarError("Incorrect email or password");
      return;
    }

    if (loginRequestResponse.code === 200) {
      console.log(loginRequestResponse);
      snackbarSuccess("Login Success");

      const userData = {
        publicKey: loginRequestResponse.publicKey,
        email: loginRequestResponse.email,
        salt: saltResponse.salt,
      };

      Cookies.set("userData", JSON.stringify(userData), {
        expires: 1,
      });

      const end = performance.now();
      console.log(`Time taken to login: ${end - start}ms`);
      navigate("/");
    }
  };

  const handleRegister = async () => {
    if (!handleValidateRegister()) return;

    const salt = generateSalt();
    const hashedPassword = hashPasswordWithSalt(password, salt);
    const { publicKeyPem } = generateKeyPairFromString(password, salt);

    const registerRequestResponse = await registerUserRequest(
      email,
      hashedPassword,
      salt,
      publicKeyPem
    );

    if (registerRequestResponse.code === 400) {
      snackbarError(registerRequestResponse.message);
      return;
    }

    console.log(registerRequestResponse);

    if (registerRequestResponse) {
      snackbarSuccess("Registration Success");
      setSelectedOption("login");
    }
  };

  const handleLoginWrapper = async () => {
    setIsProceedingRequest(true);
    await handleLogin();
    setIsProceedingRequest(false);
  };

  const handleRegisterWrapper = async () => {
    setIsProceedingRequest(true);
    await handleRegister();
    setIsProceedingRequest(false);
  };

  const handleSubmit = () => {
    if (selectedOption === "login") handleLoginWrapper();
    else handleRegisterWrapper();
  };

  useEffect(() => {
    setError(INITIAL_ERROR_STATE);
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
  }, [selectedOption]);

  useEffect(() => {
    Cookies.remove("userData");
  }, []);

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
          label="Email"
          placeholder="Your Email"
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
