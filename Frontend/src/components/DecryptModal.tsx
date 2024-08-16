import { Box, Button, Modal } from '@mui/material';
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
    color: "black"
};

const DecryptModal = ({ password, handleDecryptPassword, isModalOpen, handleClose }: Props) => {
    const [masterPassword, setMasterPassword] = useState<string>("");
    const [decryptedPassword, setDecryptedPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleLocalDecrypt = () => {
        const result = handleDecryptPassword(password, masterPassword);
        if (result) {
            setDecryptedPassword(result)
            setError("");
        } else {
            setError("Incorrect Master Password");
            setDecryptedPassword("");
        }
    }

    return (
        <div>
            <Modal
                open={isModalOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <p>Encrypted Password</p>
                    <p>{password}</p>
                    <p>Master Password</p>
                    <input type="text" onChange={(e) => setMasterPassword(e.target.value)} />
                    <br />
                    <Button onClick={() => handleLocalDecrypt()}>Decrypt</Button>
                    {decryptedPassword !== "" && <><p>Decrypted Password</p><p>{decryptedPassword}</p></>}{error && <><p>Error</p><p>{error}</p></>}
                </Box>
            </Modal>
        </div>
    )
}

export default DecryptModal