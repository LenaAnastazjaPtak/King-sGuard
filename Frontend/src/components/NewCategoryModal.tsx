import { Box, Button, Modal, TextField } from "@mui/material";
import { useState } from "react";

type Props = {
  isModalOpen: boolean;
  handleClose: () => void;
  handleAddCategory: (title: string) => any;
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
  justifyContent: "center",
  flexDirection: "column",
  gap: "1.5rem",
};

const NewCategoryModal = ({
  isModalOpen,
  handleClose,
  handleAddCategory,
}: Props) => {
  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");

  const handleValidateCategory = async () => {
    if (title === "") {
      setTitleError("Title Cannot Be Empty");
      return;
    }

    const result = await handleAddCategory(title);
    console.log("result:", result);

    if (result.code !== 201) {
      setTitleError("Category Already Exists");
      return;
    }

    handleClose();
  };

  const handleChangeTitle = (value: string) => {
    setTitle(value);
    setTitleError(value === "" ? "Title Cannot Be Empty" : "");
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{}}
    >
      <Box sx={style}>
        <TextField
          label="Category"
          placeholder="Your New Category"
          helperText={titleError}
          value={title}
          onChange={(e) => handleChangeTitle(e.target.value)}
          error={titleError !== ""}
          color="secondary"
          onKeyDown={(e) => {
            e.key === "Enter" && handleValidateCategory();
          }}
        />
        <Button
          onClick={handleValidateCategory}
          color="secondary"
          variant="contained"
        >
          Add New Category
        </Button>
      </Box>
    </Modal>
  );
};

export default NewCategoryModal;
