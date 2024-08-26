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
import Cookies from "js-cookie";

const DashboardPage = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userDataCookies, setUserDataCookies] =
    useState<UserDataCookiesInterface>();
  useAuth(() => setIsAuthenticated(true));

  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");
  const [passwords, setPasswords] = useState<PasswordInterface[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<
    PasswordInterface[]
  >([]);
  const [isAddPasswordModalOpen, setIsAddPasswordModalOpen] =
    useState<boolean>(false);
  const [isDecryptModalOpen, setIsDecryptModalOpen] = useState<boolean>(false);
  const [passwordToDecrypt, setPasswordToDecrypt] = useState<string>("");

  const handleAddNewPassword = (
    password: string,
    website: string,
    username: string
  ) => {
    if (!userDataCookies || !userDataCookies.publicKey) return;

    const encryptedPassword = encryptPassword(
      userDataCookies.publicKey,
      password
    );
    const newId = passwords.length + 1;
    const newPasswords = [
      ...passwords,
      { id: newId, password: encryptedPassword, website, username },
    ];
    setPasswords(newPasswords);
    setFilteredPasswords(newPasswords);
    setIsAddPasswordModalOpen(false);

    //request to backend to save password
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
    Cookies.remove("publicKeyPem");
    navigate("/logon");
  };

  useEffect(() => {
    const cookie = Cookies.get("userData");
    if (!cookie) {
      navigate("/logon");
      return;
    }

    const parsedCookie: UserDataCookiesInterface = JSON.parse(cookie);
    setUserDataCookies(parsedCookie);
    //fetch data from backend

    console.log("fetch");
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
    </main>
  );
};

export default DashboardPage;
