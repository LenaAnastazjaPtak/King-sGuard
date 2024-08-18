import { Box, Button, Modal, TextField } from '@mui/material';
import { useState } from 'react'

type Props = {
    password: string;
    handleDecryptPassword: (encrypted: string, masterPassword: string) => string | undefined;
    isModalOpen: boolean;
    handleClose: () => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    color: "black",
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: "0.5rem", flexDirection: 'column'
};

const paragraphStyle = {
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
}

const DecryptModal = ({ password, handleDecryptPassword, isModalOpen, handleClose }: Props) => {
    const [localMasterPassword, setLocalMasterPassword] = useState<string>("");
    const [decryptedPassword, setDecryptedPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleLocalDecrypt = () => {
        const result = handleDecryptPassword(localMasterPassword, password);
        if (result) {
            setDecryptedPassword(result)
            setError("");
        } else {
            setError("Incorrect Master Password");
            setDecryptedPassword("");
        }
    }

    const handleChangeLocalMasterPassword = (value: string) => {
        setLocalMasterPassword(value);
        setError(value === "" ? "Master Password Cannot Be Empty" : "");
    }

    return (
        <div>
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
                        placeholder='Master Password'
                        helperText={error}
                        value={localMasterPassword}
                        onChange={(e) => handleChangeLocalMasterPassword(e.target.value)}
                        error={error !== ""}
                        fullWidth
                        color='secondary'
                    />
                    <Button fullWidth
                        color='secondary' sx={{ outline: "1px solid purple" }} onClick={() => handleLocalDecrypt()}>Decrypt</Button>
                    {decryptedPassword !== "" &&
                        <div style={{ textAlign: "center" }}>
                            <p>Your Decrypted Password:</p>
                            <h3>{decryptedPassword}</h3>
                        </div>}
                    {error && <h4>Error: {error}</h4>}
                </Box>
            </Modal>
        </div>
    )
}

export default DecryptModal