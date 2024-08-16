import { Box, Button, Modal, Typography } from '@mui/material';
import { useState } from 'react';

type Props = {
    isModalOpen: boolean;
    handleClose: () => void;
    handleSave: (password: string, website: string) => void;
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

const NewPasswordModal = ({ isModalOpen, handleClose, handleSave }: Props) => {
    const [password, setPassword] = useState<string>("");
    const [website, setWebsite] = useState<string>("");

    return (
        <div>
            <Modal
                open={isModalOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <p>Website</p>
                    {/* <Typography>Website</Typography> */}
                    <input type="text" onChange={(e) => setWebsite(e.target.value)} />
                    <p>Password</p>
                    <input type="text" onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    <Button onClick={() => handleSave(password, website)}>Add New Password</Button>
                </Box>
            </Modal>
        </div>
    )
}

export default NewPasswordModal