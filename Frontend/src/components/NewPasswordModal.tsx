import { Box, Button, Modal, TextField } from "@mui/material";
import { useState } from "react";
import CustomSwitch from "./CustomSwitch";
import PasswordGenerator from "./PasswordGenerator";

type Props = {
  isModalOpen: boolean;
  handleClose: () => void;
  handleSave: (
    password: string,
    website: string,
    username: string,
    category: string
  ) => void;
};

const style = {
  position: "absolute" as const,
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
  justifyContent: "center",
  flexDirection: "column",
  gap: "1.5rem",
};

const NewPasswordModal = ({ isModalOpen, handleClose, handleSave }: Props) => {
  const [password, setPassword] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [passwordSource, setPasswordSource] = useState<string>("Your Password");
  const [websiteError, setWebsiteError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const handleAddNewPassword = () => {
    if (website === "") {
      setWebsiteError("Website Cannot Be Empty");
      return;
    }
    if (password === "") {
      setPasswordError("Password Cannot Be Empty");
      return;
    }
    handleSave(password, website, username, "1");
  };

  const handleChangeWebsite = (value: string) => {
    setWebsite(value);
    setWebsiteError(value === "" ? "Website Cannot Be Empty" : "");
  };

  const handleChangePassword = (value: string) => {
    setPassword(value);
    setPasswordError(value === "" ? "Password Cannot Be Empty" : "");
  };

  const handleChangePasswordSource = (value: string) => {
    if (value === "Your Password") setPassword("");
    setPasswordSource(value);
  };

  return (
    <div>
      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{}}
      >
        <Box sx={style}>
          <TextField
            label="Website"
            placeholder="Your Website"
            helperText={websiteError}
            value={website}
            onChange={(e) => handleChangeWebsite(e.target.value)}
            error={websiteError !== ""}
            color="secondary"
          />
          <TextField
            label="Username"
            placeholder="Your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            color="secondary"
          />
          <CustomSwitch
            options={["Your Password", "Generated Password"]}
            selected={passwordSource}
            setSelected={handleChangePasswordSource}
          />
          {passwordSource === "Your Password" ? (
            <TextField
              label="Password"
              placeholder="Your Password"
              helperText={passwordError}
              value={password}
              onChange={(e) => handleChangePassword(e.target.value)}
              error={passwordError !== ""}
              type="password"
              color="secondary"
            />
          ) : (
            <PasswordGenerator
              setPassword={setPassword}
              password={password}
              width="100%"
            />
          )}
          <Button
            onClick={handleAddNewPassword}
            color="secondary"
            variant="contained"
          >
            Add New Password
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default NewPasswordModal;
