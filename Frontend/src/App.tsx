import { useState } from "react";
// import { useEffect } from "react";
import "./App.css";
// import PasswordGenerator from "./components/PasswordGenerator";
// import forge from 'node-forge';
// import { comparePemKeys, decryptPassword, encryptPassword, generateKeyPairFromString, verifyKeyPair } from "./crypt";
import { decryptPassword, encryptPassword, verifyMasterPassword } from "./crypt";
import { PUBLIC_KEY_PEM } from "./utils";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { PasswordInterface } from "./interfaces";
import PasswordGenerator from "./components/PasswordGenerator";
import NewPasswordModal from "./components/NewPasswordModal";
import DecryptModal from "./components/DecryptModal";
import LogonComponent from "./components/LogonComponent";

const PASSWORDS: PasswordInterface[] = [
  { id: 1, password: "r/OI1fe60CQX/mzj2pX0FYEKzppUFvfLZwZ6S7DoMMAF9r4JUZJF/Hu4t0yGdP0IxJIfTUJJ/QJyVCc9JPRl6ikUO2T7T5nBRlqffL1zSQN1NG3D11wu1bLOqZ2hdA57lwCSGtVfEXQsKl/4AQ+x+3ZOnSgirS+hFp9AZO7klsl1ZzkHbDaPyC3hwIzm7CfPArClZ2VWm/lZcvKWjsr9lWse9oJy2sQzRR3zcikmx8hoO27NtqTO/EpsDhWBUKNt", website: "youtube.com" },
  { id: 2, password: "1RtGehcK+w2Mn0dWnTmejNL9yvUNwvPa6Q+Ie+5S6x6cSRaocWqJYSc2M+/ANi6TpF7CxjQprW/NGMkzK7ocNnlsYInO7ryeZb0QJwppJ2Vutbal5Hn7e04GkjqLvRrUBXu3jIlyQ4BbZbyoVgvOr3KTPvJUg4V9Tb/DpuI6tkXonoqOxxfx9LjXhxw6LymJ6cAfKSLEGabS5a6qrBXXyNT347+Dq+5O5r2/XYZHT6yoNnvaeOgWzLRy6Zk2RosR", website: "facebook.com" },
  { id: 3, password: "uK/FeX5W94f6apaXr6y8kLSFTf/URiFsSLOIuhHWnOiQK8riSvkReNZSyKydtXTc969c9qG9/y9IHeOKdX308S0lBQexg+V3zwaQChzLjNr3JYAdmEk0OVS+tciIfxLy8zAVN8c4KPY6tuI0CY4uz1Yx5FVNpEV1TIHthtNbKRpiSDsAPPtQyHmj/qtLDcRniZi6IaE2vih4XX+fyu/cqSrFzagM9Y04SovOG+FMmHzCGe9FjpO7xDhA0F1SxF6e", website: "google.com" }
]


const App = () => {
  const [masterPassword, setMasterPassword] = useState<string>("ABCDEFG");
  const [password, setPassword] = useState<string>("XYZ");
  // const [encryptedPassword, setEncryptedPassword] = useState<string>("");
  // const [equal, setEqual] = useState<boolean>(false);
  // const [newPassword, setNewPassword] = useState<string>("");
  // const [newPrivateKeyPem, setNewPrivateKeyPem] = useState<string>("");
  // const [newPublicKeyPem, setNewPublicKeyPem] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [filteredPasswords, setFilteredPasswords] = useState<PasswordInterface[]>(PASSWORDS);
  const [passwordToDecrypt, setPasswordToDecrypt] = useState<string>("");
  // const [decryptedPassword, setDecryptedPassword] = useState<string>("");
  const [isAddPasswordModalOpen, setIsAddPasswordModalOpen] = useState<boolean>(false);
  const [isDecryptModalOpen, setIsDecryptModalOpen] = useState<boolean>(false);

  // const [privateKeyPem, setPrivateKeyPem] = useState<string>("");
  // const [publicKeyPem, setPublicKeyPem] = useState<string>("");

  // const handleGenerateKeyPair = () => {
  //   const { privateKeyPem, publicKeyPem } = generateKeyPairFromString(masterPassword);
  //   setPrivateKeyPem(privateKeyPem);
  //   setPublicKeyPem(publicKeyPem);
  // }

  const handleAddNewPassword = (password: string, website: string) => {
    const encryptedPassword = encryptPassword(PUBLIC_KEY_PEM, password);
    const newId = PASSWORDS[PASSWORDS.length - 1].id + 1;
    const newPasswords = [...PASSWORDS, { id: newId, password: encryptedPassword, website }];
    PASSWORDS.push({ id: newId, password, website });
    setFilteredPasswords(newPasswords);
    setIsAddPasswordModalOpen(false);
  }


  const handleSearch = (str: string) => {
    setSearch(str);

    const localFilteredPasswords = PASSWORDS.filter((pass) => pass.website.toLowerCase().includes(str.toLowerCase()));

    setFilteredPasswords(localFilteredPasswords);
  }

  // const handleEncryptPassword = (pass: string) => {
  //   const encrypted = encryptPassword(PUBLIC_KEY_PEM, pass);
  //   setEncryptedPassword(encypted);
  //   handleAddNewPassword(pass, "test.com");
  // }

  const handleDecryptPassword = (passedMasterPassword: string, encryptedPassword: string) => {

    const localPEM = verifyMasterPassword(passedMasterPassword, PUBLIC_KEY_PEM);
    if (!localPEM) return;

    return (decryptPassword(localPEM, encryptedPassword));
    // alert(decrypted);
    // setDecryptedPassword(decrypted);
  }

  const handleDecryptPasswordButton = (password: string) => {
    console.log(password)
    setPasswordToDecrypt(password);
    setIsDecryptModalOpen(true);
  }

  // return <LogonComponent />


  return <main style={{ width: "1000px" }}>
    {/* <PasswordGenerator setPassword={setPassword} password={password} /> */}
    {/* <input type="text" onChange={(e) => setPassword(e.target.value)} />
    <p>Password Before Encription: {password}</p>
    <button onClick={() => handleGenerateKeyPair()}>GENERATE</button>
    <p>Private: {privateKeyPem}</p>
    <p>Public: {publicKeyPem}</p> */}
    <button onClick={() => verifyMasterPassword(masterPassword, PUBLIC_KEY_PEM)}>Verify</button>
    <h3>MASTER PASSWORD</h3>
    <input type="text" value={masterPassword} onChange={(e) => { setMasterPassword(e.target.value) }} />
    {/* 
    <hr />
    <input type="text" value={password} onChange={(e) => { setPassword(e.target.value) }} />
    <div>
      <h3>Encrypt Password</h3>
      <button onClick={() => handleEncryptPassword(password)}>ENCRYPT</button>
      <p style={{ wordWrap: "break-word" }}>{encryptedPassword}</p>
    </div>
    <hr />
    <div>
      <h3>DECRYPT PASSWORD</h3>
      <button onClick={tmpWrapper}>DECRYPT</button>
      {decryptedPassword && <p style={{ wordWrap: "break-word" }}>{decryptedPassword}</p>}
    </div> */}
    <br />
    <hr />
    <button onClick={() => { setIsAddPasswordModalOpen(true) }}>ADD NEW PASSWORD</button>
    <hr />
    <label htmlFor="searchbar">Search: </label><input type="text" name="searchbar" id="searchbar" value={search} onChange={(e) => handleSearch(e.target.value)} />
    <br />
    <br />
    <br />
    {filteredPasswords.length > 0 ? <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, maxWidth: "1000px" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{ width: "10%" }}>ID</TableCell>
            <TableCell align="center" style={{ width: "20%" }}>Website</TableCell>
            <TableCell align="center" style={{ width: "50%" }}>Password</TableCell>
            <TableCell align="center" style={{ width: "20%" }}>Decrypt</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPasswords.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center">{row.id}</TableCell>
              <TableCell component="th" scope="row">
                {row.website}
              </TableCell>
              <TableCell align="center" sx={{
                maxWidth: "500px",
              }}
              ><p style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: '500px'
              }}>{row.password}</p></TableCell>
              <TableCell align="center"><button onClick={() => handleDecryptPasswordButton(row.password)}>DECRYPT</button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer> :
      <div><h3>No data matches search phrase</h3></div>
    }
    {isAddPasswordModalOpen && <NewPasswordModal isModalOpen={isAddPasswordModalOpen} handleClose={() => setIsAddPasswordModalOpen(false)} handleSave={handleAddNewPassword} />}
    {isDecryptModalOpen && <DecryptModal password={passwordToDecrypt} handleDecryptPassword={handleDecryptPassword} isModalOpen={isDecryptModalOpen} handleClose={() => setIsDecryptModalOpen(false)} />}
  </main >;
}

export default App;
