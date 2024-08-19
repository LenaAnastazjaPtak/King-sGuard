import { createRef, useState } from 'react'
import CustomSwitch from './CustomSwitch';
// import ReCAPTCHA from 'react-google-recaptcha'

import { Button, TextField, FormControl, Paper } from '@mui/material';
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from 'react-router-dom';
// type Props = {}

interface ErrorInterface {
  username: string,
  password: string,
  passwordConfirmation: string
}

const INITIAL_ERROR_STATE: ErrorInterface = {
  username: "",
  password: "",
  passwordConfirmation: ""
}

const LogonComponent = () => {
  // const captchaRef = createRef<ReCAPTCHA>(null)
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("login");
  const [error, setError] = useState<ErrorInterface>(INITIAL_ERROR_STATE);
  const [isProceedingRequest, setIsProceedingRequest] = useState<boolean>(false);
  const OPTIONS = ["login", "register"];

  const navigate = useNavigate()

  const handleChangeSelectedOption = (option: string) => {
    setSelectedOption(option)
    setError(INITIAL_ERROR_STATE)
    setUsername("")
    setPassword("")
    setPasswordConfirmation("")
  }

  const handleChangeUsername = (value: string) => {
    setUsername(value);
    setError({ ...error, username: value === "" ? "Username Cannot Be Empty" : "" });
  }

  const handleChangePassword = (value: string) => {
    setPassword(value);
    setError({ ...error, password: value === "" ? "Password Cannot Be Empty" : "" });
  }

  const handleChangePasswordConfirmation = (value: string) => {
    setPasswordConfirmation(value);
    setError({ ...error, passwordConfirmation: value === "" ? "Password Confirmation Cannot Be Empty" : "" });
  }

  const handleLogin = () => {
    console.log("login")
    setIsProceedingRequest(true)
    let newError = { ...error }

    if (username === "") newError.username = "Username Cannot Be Empty"
    if (password === "") newError.password = "Password Cannot Be Empty"
    setError(newError)

    if (username === "" || password === "") {
      setIsProceedingRequest(false)
      return
    };

    setError(INITIAL_ERROR_STATE);
    // const captchaValue = captchaRef.current?.getValue()
    // if (!captchaValue) {
    //   console.error("Please complete the captcha")
    //   console.error(captchaValue)
    //   return
    // }

    console.log("login proceeded")
    localStorage.setItem("isLoggedIn", "true")

    // IMITATE REQUEST TO BACKEND

    setTimeout(() => {
      setIsProceedingRequest(false)
      navigate("/")
    }, 2000)
  }

  const handleRegister = () => {
    console.log("register")
    setIsProceedingRequest(true)
    const newError = { ...error }

    if (username === "") newError.username = "Username Cannot Be Empty"
    if (password === "") newError.password = "Password Cannot Be Empty"
    if (passwordConfirmation === "") newError.passwordConfirmation = "Password Confirmation Cannot Be Empty"
    if (password !== passwordConfirmation) newError.passwordConfirmation = "Passwords Do Not Match"
    setError(newError)

    if (username === "" || password === "" || passwordConfirmation === "" || password !== passwordConfirmation) {
      setIsProceedingRequest(false)
      return;
    }

    setError(INITIAL_ERROR_STATE);

    console.log("register proceeded")

    // IMITATE REQUEST TO BACKEND
    setTimeout(() => {
      setIsProceedingRequest(false)
      handleChangeSelectedOption("login")

    }, 2000)
  }

  return (
    <Paper sx={{ maxWidth: "500px", width: "450px", height: "450px", boxSizing: 'border-box' }}>
      <FormControl style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "2rem", height: "100%", boxSizing: 'border-box' }}>
        <CustomSwitch options={OPTIONS} selected={selectedOption} setSelected={handleChangeSelectedOption} />
        <TextField
          label="Username"
          placeholder='Your Username'
          color='secondary'
          value={username}
          error={error.username !== ""}
          helperText={error.username}
          onChange={(e) => handleChangeUsername(e.target.value)}
          fullWidth
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          placeholder='Your Password'
          value={password}
          error={error.password !== ""}
          helperText={error.password}
          color='secondary'
          onChange={(e) => handleChangePassword(e.target.value)}
        />
        {selectedOption === "register" && <TextField
          fullWidth
          label="Password Confirmation"
          type="password"
          color='secondary'
          error={error.passwordConfirmation !== ""}
          placeholder='Password Confirmation'
          value={passwordConfirmation}
          helperText={error.passwordConfirmation}
          onChange={(e) => handleChangePasswordConfirmation(e.target.value)}
        />}
        {/* <ReCAPTCHA sitekey={import.meta.env.VITE_SITE_KEY} ref={createRef} /> */}
        {!isProceedingRequest ? <Button
          onClick={selectedOption === "login" ? handleLogin : handleRegister}
          sx={{ marginTop: "auto", height: "2.5rem" }}
          fullWidth
          variant="contained"
          color="secondary"
        >
          {selectedOption}
        </Button> : <LoadingButton
          sx={{ marginTop: "auto", height: "2.5rem" }}
          fullWidth
          variant="contained"
          color="secondary"
          loading
        />
        }
      </FormControl>

    </Paper>
  )
}

export default LogonComponent