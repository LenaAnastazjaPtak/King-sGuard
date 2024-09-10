import { useEffect, useState } from "react";
import "../App.css";
import {
  decryptPassword,
  encryptPassword,
  verifyMasterPassword,
} from "../crypt";
import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { PasswordInterface, UserDataCookiesInterface } from "../interfaces";
import NewPasswordModal from "../components/NewPasswordModal";
import DecryptModal from "../components/DecryptModal";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getUserDataFromCookies, removeUserDataFromCookies } from "../utils";
import {
  addCategoryRequest,
  getCategoriesRequest,
} from "../services/api/categoriesRequest";
import {
  addNewPasswordRequest,
  getPasswordsRequest,
} from "../services/api/passwordRequest";
import useSnackbarHook from "../hooks/useSnackbar";
import NewCategoryModal from "../components/NewCategoryModal";

const DashboardPage = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userDataCookies, setUserDataCookies] =
    useState<UserDataCookiesInterface>();

  const [search, setSearch] = useState<string>("");
  const [passwords, setPasswords] = useState<PasswordInterface[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<
    PasswordInterface[]
  >([]);

  const [passwordToDecrypt, setPasswordToDecrypt] = useState<string>("");

  const [isAddPasswordModalOpen, setIsAddPasswordModalOpen] =
    useState<boolean>(false);
  const [isDecryptModalOpen, setIsDecryptModalOpen] = useState<boolean>(false);
  const [isAddNewCategoryModalOpen, setIsAddNewCategoryModalOpen] =
    useState<boolean>(false);

  const navigate = useNavigate();
  useAuth(() => setIsAuthenticated(true));
  const { snackbarError, snackbarSuccess } = useSnackbarHook();

  const handleAddNewPassword = async (
    password: string,
    website: string,
    username: string,
    category: string
  ) => {
    if (!userDataCookies || !userDataCookies.publicKey) return;

    const encryptedPassword = encryptPassword(
      userDataCookies.publicKey,
      password
    );
    if (!encryptedPassword) {
      snackbarError("Error encrypting password");
      return;
    }

    const newId = passwords.length + 1;

    const newPassword: PasswordInterface = {
      id: newId,
      password: encryptedPassword,
      website,
      username,
      category,
    };

    const response = await addNewPasswordRequest(
      website,
      encryptedPassword,
      username,
      userDataCookies.id,
      null,
      userDataCookies.email,
      "title"
    );

    console.log(response);

    if (response.code !== 201) {
      snackbarError("Error saving password");
      return;
    }

    snackbarSuccess("Password saved successfully");

    const newPasswords: PasswordInterface[] = [...passwords, newPassword];
    setPasswords(newPasswords);
    setFilteredPasswords(newPasswords);
    setIsAddPasswordModalOpen(false);
    //request to backend to save password
  };

  const handleAddCategory = async (title: string) => {
    if (!userDataCookies || !userDataCookies.email) return;
    const result = await addCategoryRequest(title, userDataCookies.email);

    if (result.code !== 201) snackbarError(result.message);
    else snackbarSuccess(result.message);

    return result;
  };

  const handleSearch = (str: string) => {
    setSearch(str);

    const localFilteredPasswords = passwords.filter(
      (pass) =>
        pass.website.toLowerCase().includes(str.toLowerCase()) ||
        pass.username.toLowerCase().includes(str.toLowerCase())
    );

    setFilteredPasswords(localFilteredPasswords);
  };

  const handleDecryptPassword = (
    passedMasterPassword: string,
    salt: string,
    publicKeyPem: string,
    encryptedPassword: string
  ) => {
    const start = performance.now();
    const localPEM = verifyMasterPassword(
      passedMasterPassword,
      salt,
      publicKeyPem
    );

    if (!localPEM) return;

    const decrypted = decryptPassword(localPEM, encryptedPassword);
    const end = performance.now();
    console.log("Decryption time: ", end - start);
    return decrypted;
  };

  const handleDecryptPasswordButton = (password: string) => {
    console.log(password);
    setPasswordToDecrypt(password);
    setIsDecryptModalOpen(true);
  };

  const handleLogout = () => {
    removeUserDataFromCookies();
    navigate("/logon");
  };

  const handleGetUserCategories = async () => {
    console.log("Getting categories");
    const categories = await getCategoriesRequest();
    console.log(categories);
  };

  const handleGetUserPasswords = async () => {
    console.log("Getting passwords");
    if (!userDataCookies || !userDataCookies.id) return;

    const passwords = await getPasswordsRequest(userDataCookies.id);
    console.log(passwords);
  };

  useEffect(() => {
    const userData = getUserDataFromCookies();
    if (!userData) return;
    setUserDataCookies(userData);
    setIsLoaded(true);
  }, []);

  if (!isLoaded || !isAuthenticated || !userDataCookies) {
    return (
      <main>
        <CircularProgress />
      </main>
    );
  }

  return (
    <main style={{ width: "1000px" }}>
      <div>
        <Button onClick={handleLogout} variant="outlined" color="secondary">
          Logout
        </Button>

        <Button
          onClick={() => {
            setIsAddPasswordModalOpen(true);
          }}
          variant="contained"
          color="secondary"
        >
          ADD NEW PASSWORD
        </Button>
        <Button
          onClick={handleGetUserCategories}
          variant="contained"
          color="secondary"
        >
          GET CATEGORIES
        </Button>
        <Button
          onClick={handleGetUserPasswords}
          variant="contained"
          color="secondary"
        >
          GET PASSWORDS
        </Button>
        <Button
          onClick={() => setIsAddNewCategoryModalOpen(true)}
          variant="contained"
          color="secondary"
        >
          ADD CATEGORY
        </Button>
      </div>
      <div>
        <TextField
          type="text"
          sx={{ color: "white" }}
          placeholder="Search"
          variant="outlined"
          color="secondary"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {filteredPasswords.length > 0 ? (
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650, maxWidth: "1000px" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ width: "10%" }}>
                  ID
                </TableCell>
                <TableCell align="center" style={{ width: "20%" }}>
                  Website
                </TableCell>
                <TableCell align="center" style={{ width: "50%" }}>
                  Password
                </TableCell>
                <TableCell align="center" style={{ width: "20%" }}>
                  Decrypt
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPasswords.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{row.id}</TableCell>
                  <TableCell component="th" scope="row">
                    {row.website}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      maxWidth: "500px",
                    }}
                  >
                    <p
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "500px",
                      }}
                    >
                      {row.password}
                    </p>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => handleDecryptPasswordButton(row.password)}
                      variant="contained"
                      color="secondary"
                    >
                      DECRYPT
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div>
          <h3>No data matches search phrase</h3>
        </div>
      )}
      {isAddPasswordModalOpen && (
        <NewPasswordModal
          isModalOpen={isAddPasswordModalOpen}
          handleClose={() => setIsAddPasswordModalOpen(false)}
          handleSave={handleAddNewPassword}
        />
      )}
      {isDecryptModalOpen && (
        <DecryptModal
          password={passwordToDecrypt}
          handleDecryptPassword={handleDecryptPassword}
          isModalOpen={isDecryptModalOpen}
          handleClose={() => setIsDecryptModalOpen(false)}
          userDataCookies={userDataCookies}
        />
      )}
      {isAddNewCategoryModalOpen && (
        <NewCategoryModal
          isModalOpen={isAddNewCategoryModalOpen}
          handleClose={() => setIsAddNewCategoryModalOpen(false)}
          handleAddCategory={handleAddCategory}
        />
      )}
    </main>
  );
};

export default DashboardPage;
