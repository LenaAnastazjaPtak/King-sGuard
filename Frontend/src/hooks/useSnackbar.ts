import { useSnackbar } from "notistack";

const AUTO_HIDE_DURATION = 3000;
const HORIZONTAL_POSITION = "right" as "right";
const VERTICAL_POSITION = "bottom" as "bottom";

const SNACKBAR_DEFAULT_OPTIONS = {
  autoHideDuration: AUTO_HIDE_DURATION,
  anchorOrigin: {
    vertical: VERTICAL_POSITION,
    horizontal: HORIZONTAL_POSITION,
  },
};

const snackbarHook = () => {
  const { enqueueSnackbar } = useSnackbar();

  const snackbarError = (message: string) => {
    enqueueSnackbar(message, {
      variant: "error",
      ...SNACKBAR_DEFAULT_OPTIONS,
    });
  };

  const snackbarSuccess = (message: string) => {
    enqueueSnackbar(message, {
      variant: "success",
      ...SNACKBAR_DEFAULT_OPTIONS,
    });
  };

  const snackbarWarning = (message: string) => {
    enqueueSnackbar(message, {
      variant: "warning",
      ...SNACKBAR_DEFAULT_OPTIONS,
    });
  };

  const snackbarInfo = (message: string) => {
    enqueueSnackbar(message, {
      variant: "info",
      ...SNACKBAR_DEFAULT_OPTIONS,
    });
  };

  return { snackbarError, snackbarSuccess, snackbarWarning, snackbarInfo };
};

export default snackbarHook;
