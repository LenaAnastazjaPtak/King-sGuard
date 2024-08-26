import { Box, Button, Modal, TextField } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { UserDataCookiesInterface } from "../interfaces";
import Cookies from "js-cookie";
import { LoadingButton } from "@mui/lab";

type Props = {
  password: string;
  handleDecryptPassword: (
    masterPassword: string,
    salt: string,
    publicKey: string,
    encrypted: string
  ) => string | undefined;
  isModalOpen: boolean;
  handleClose: () => void;
  userDataCookies: UserDataCookiesInterface;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  color: "black",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  flexDirection: "column",
};

const paragraphStyle = {
  width: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const DecryptModal = ({
  password,
  handleDecryptPassword,
  isModalOpen,
  handleClose,
  userDataCookies,
}: Props) => {
  const [localMasterPassword, setLocalMasterPassword] = useState<string>("");
  const [decryptedPassword, setDecryptedPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isProceedingRequest, setIsProceedingRequest] =
    useState<boolean>(false);

  const handleLocalDecrypt = () => {
    const result = handleDecryptPassword(
      localMasterPassword,
      userDataCookies.salt,
      userDataCookies.publicKey,
      password
    );

    if (result) {
      setDecryptedPassword(result);
      setError("");
    } else {
      setError("Incorrect Master Password");
      setDecryptedPassword("");
    }
  };

  const handleLocalDecryptWrapper = () => {
    setIsProceedingRequest(true);
    setTimeout(() => {
      handleLocalDecrypt();
      setIsProceedingRequest(false);
    }, 0);
  };

  const handleChangeLocalMasterPassword = (value: string) => {
    setLocalMasterPassword(value);
    setError(value === "" ? "Master Password Cannot Be Empty" : "");
  };

  useEffect(() => {
    console.log(`isProceedingRequest: ${isProceedingRequest}`);
  }, [isProceedingRequest]);
  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{}}
    >
      <Box sx={style}>
        <h3>Encrypted Password</h3>
        <p style={paragraphStyle}>{password}</p>
        <h3>Master Password</h3>
        <TextField
          id="outlined-error-helper-text"
          label="Master Password"
          placeholder="Master Password"
          helperText={error}
          value={localMasterPassword}
          onChange={(e) => handleChangeLocalMasterPassword(e.target.value)}
          error={error !== ""}
          fullWidth
          color="secondary"
          type="password"
        />
        {!isProceedingRequest ? (
          <Button
            fullWidth
            color="secondary"
            onClick={handleLocalDecryptWrapper}
            variant="contained"
          >
            Decrypt
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
        {decryptedPassword !== "" && (
          <div style={{ textAlign: "center" }}>
            <p>Your Decrypted Password:</p>
            <h3>{decryptedPassword}</h3>
          </div>
        )}
        {error && <h4>Error: {error}</h4>}
      </Box>
    </Modal>
  );
};

export default DecryptModal;
