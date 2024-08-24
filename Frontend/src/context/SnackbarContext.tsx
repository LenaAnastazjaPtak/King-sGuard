import { Snackbar, SnackbarContent } from "@mui/material";
import { createContext, useState, useContext } from "react";

type SnackbarTypeType = "success" | "error" | "info" | "warning";

interface SnackbarContextInterface {
  openSnackbar: (message: string, type?: SnackbarTypeType) => void;
}

interface SnackbarProviderProps {
  children: React.ReactNode;
}

const SnackbarContext = createContext<SnackbarContextInterface | undefined>(
  undefined
);

const SNACKBAR_BACKGROUND_COLOR: Record<SnackbarTypeType, string> = {
  success: "#43a047",
  error: "#d32f2f",
  info: "#1976d2",
  warning: "#ffa000",
};

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [type, setType] = useState<SnackbarTypeType>("success");

  const openSnackbar = (message: string, type?: SnackbarTypeType) => {
    setType(type || "success");
    setMessage(message);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      {children}
      <Snackbar
        open={isOpen}
        message={message}
        onClose={handleClose}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        style={{ backgroundColor: SNACKBAR_BACKGROUND_COLOR[type] }}
      >
        <SnackbarContent
          message={message}
          sx={{ background: SNACKBAR_BACKGROUND_COLOR[type] }}
        />
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  return context;
};
