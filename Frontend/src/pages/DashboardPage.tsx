import { useEffect, useState } from "react";
import "../App.css";
import {
  decryptPassword,
  encryptPassword,
  generateKeyPairFromString,
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
import {
  CategoryInterface,
  PasswordInterface,
  UserDataCookiesInterface,
} from "../interfaces";
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

const INITIAL_PASSWORD_TO_DECRYPT: PasswordInterface = {
  id: "0",
  password: "",
  website: "",
  username: "",
  categoryId: null,
  category: null,
  notes: null,
  title: "",
  user: "",
};

const DashboardPage = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userDataCookies, setUserDataCookies] =
    useState<UserDataCookiesInterface>();

  const [search, setSearch] = useState<string>("");
  const [passwords, setPasswords] = useState<PasswordInterface[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<
    PasswordInterface[]
  >([]);

  const [passwordToDecrypt, setPasswordToDecrypt] = useState<PasswordInterface>(
    INITIAL_PASSWORD_TO_DECRYPT
  );

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
    category: string | null,
    title: string
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
      id: newId.toString(),
      password: encryptedPassword,
      website,
      username,
      category,
      categoryId: categories.find((cat) => cat.title === category)?.id || null,
      notes: null,
      title,
      user: "",
    };

    const response = await addNewPasswordRequest(
      website,
      encryptedPassword,
      username,
      userDataCookies.id,
      category,
      userDataCookies.email,
      title
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

    if (result.code === 201) {
      snackbarSuccess(result.message);
      const newCategory: CategoryInterface = {
        id: result.id,
        title,
        user: userDataCookies.email,
        uuid: result.uuid,
      };
      setCategories([...categories, newCategory]);
    } else snackbarError(result.message);

    return result;
  };

  const handleSearch = (str: string) => {
    setSearch(str);
    console.log(str);
    const localFilteredPasswords = passwords.filter(
      (pass) =>
        (pass.website &&
          pass.website.toLowerCase().includes(str.toLowerCase())) ||
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

  const handleDecryptPasswordButton = (passwordId: string) => {
    const passwordToDecryptLocal = passwords.find(
      (pass) => pass.id === passwordId
    );
    console.log("passwordToDecryptLocal", passwordToDecryptLocal);
    setPasswordToDecrypt(passwordToDecryptLocal || INITIAL_PASSWORD_TO_DECRYPT);
    setIsDecryptModalOpen(true);
  };

  const handleLogout = () => {
    removeUserDataFromCookies();
    navigate("/logon");
  };

  const handleGetUserCategories = async () => {
    console.log("Getting categories");
    if (!userDataCookies || !userDataCookies.email) return;
    const categories = await getCategoriesRequest(userDataCookies.email);
    console.log(categories);
  };

  const handleGetUserPasswords = async () => {
    console.log("Getting passwords");
    if (!userDataCookies || !userDataCookies.email) return;
    const passwords = await getPasswordsRequest(userDataCookies.email);
    console.log(passwords);
  };

  const handleCheck = () => {
    console.log("Check");
    const { publicKeyPem } = generateKeyPairFromString(
      "x",
      userDataCookies!.salt
    );
    console.log(publicKeyPem);
    console.log(userDataCookies!.publicKey);
    console.log(publicKeyPem === userDataCookies!.publicKey);
  };

  useEffect(() => {
    const init = async () => {
      const userData = getUserDataFromCookies();
      if (!userData) return;
      const promises = await Promise.all([
        getPasswordsRequest(userData.email),
        getCategoriesRequest(userData.email),
      ]);
      if (!promises) return;
      const [passwordsResponse, categoriesResponse] = promises;
      console.log("categories", categoriesResponse);

      const passwords = passwordsResponse.message.map((password: any) => {
        return {
          id: password.id as string,
          website: password.url,
          password: password.password,
          category: password.category,
          categoryId: password.categoryId,
          notes: password.notes,
          title: password.title,
          email: password.user,
          username: password.username,
        };
      });
      console.log("passwords", passwords);

      setCategories(categoriesResponse.message);
      setPasswords(passwords);
      setFilteredPasswords(passwords);
      setUserDataCookies(userData);
      setIsLoaded(true);
    };
    init();
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

        <Button onClick={handleCheck} variant="outlined" color="secondary">
          Verify Key
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
                <TableCell align="center" style={{ width: "30%" }}>
                  Password
                </TableCell>
                <TableCell align="center" style={{ width: "20%" }}>
                  Category
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
                  <TableCell component="th" scope="row">
                    {row.category}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => handleDecryptPasswordButton(row.id)}
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
          categories={categories}
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
