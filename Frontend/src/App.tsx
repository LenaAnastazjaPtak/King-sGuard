import { useEffect, useState } from "react";
import "./App.css";
import PasswordGenerator from "./components/PasswordGenerator";
import forge from 'node-forge';
import { comparePemKeys, decryptPassword, encryptPassword, generateKeyPairFromString, verifyKeyPair } from "./crypt";
import { PRIVATE_KEY_PEM, PUBLIC_KEY_PEM } from "./utils";

function App() {
  const [masterPassword, setMasterPassword] = useState<string>("ABCDEFGH");
  const [password, setPassword] = useState<string>("XYZ");
  const [encryptedPassword, setEncryptedPassword] = useState<string>("");
  const [decryptedPassword, setDecryptedPassword] = useState<string>("");
  const [equal, setEqual] = useState<boolean>(false);
  const [correctPassword, setCorrectPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPrivateKeyPem, setNewPrivateKeyPem] = useState<string>("");
  const [newPublicKeyPem, setNewPublicKeyPem] = useState<string>("");
  // const [privateKeyPem, setPrivateKeyPem] = useState<string>("");
  // const [publicKeyPem, setPublicKeyPem] = useState<string>("");

  // const handleGenerateKeyPair = () => {
  //   const { privateKeyPem, publicKeyPem } = generateKeyPairFromString(masterPassword);
  //   setPrivateKeyPem(privateKeyPem);
  //   setPublicKeyPem(publicKeyPem);
  // }

  const PASSWORDS = [
    { password: "1xE/jhllWU0oF5YN8bXqNP8dpe78Odgc7DChqkcQtjzRXgeA1AlDG2kzfypNosykBTQycKAO1it3t4FPqhRFQVzmQNx/QsgjH53KgAKvV5NCD5yJxUSiz4wTO7/GF2TTYPzApQHUab3EntdIJ3YlAWlcGoBREQbk+O1j4nb0+Pvw2NaGpsnOQBiP0H+GseIWaTBx/kiTvBaFVsCCYWeWHnRz8pM8ubRgbG/Qvp2PXIfHlizarvQ1TckPly49GkaD", website: "youtube.com" },
    { password: "1RtGehcK+w2Mn0dWnTmejNL9yvUNwvPa6Q+Ie+5S6x6cSRaocWqJYSc2M+/ANi6TpF7CxjQprW/NGMkzK7ocNnlsYInO7ryeZb0QJwppJ2Vutbal5Hn7e04GkjqLvRrUBXu3jIlyQ4BbZbyoVgvOr3KTPvJUg4V9Tb/DpuI6tkXonoqOxxfx9LjXhxw6LymJ6cAfKSLEGabS5a6qrBXXyNT347+Dq+5O5r2/XYZHT6yoNnvaeOgWzLRy6Zk2RosR", website: "facebook.com" },
    { password: "uK/FeX5W94f6apaXr6y8kLSFTf/URiFsSLOIuhHWnOiQK8riSvkReNZSyKydtXTc969c9qG9/y9IHeOKdX308S0lBQexg+V3zwaQChzLjNr3JYAdmEk0OVS+tciIfxLy8zAVN8c4KPY6tuI0CY4uz1Yx5FVNpEV1TIHthtNbKRpiSDsAPPtQyHmj/qtLDcRniZi6IaE2vih4XX+fyu/cqSrFzagM9Y04SovOG+FMmHzCGe9FjpO7xDhA0F1SxF6e", website: "google.com" }
  ]

  const ENCRYPTED_PASSWORD_STYLE = {
    width: "300px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",

  }

  const handleGeneratePrivateKeyPem = (str: string) => {
    if (str === "") return;
    const startTime = performance.now();
    const { privateKeyPem, publicKeyPem } = generateKeyPairFromString(str);
    console.log(privateKeyPem);

    setEqual(comparePemKeys(privateKeyPem, PRIVATE_KEY_PEM));
    setNewPrivateKeyPem(privateKeyPem);
    setNewPublicKeyPem(publicKeyPem);

    const endTime = performance.now();
    if (!verifyKeyPair(PUBLIC_KEY_PEM, privateKeyPem)) {
      console.log("INCORRECT PASSWORD");
      return;
    }
    console.log(`Time taken to generate private PEM: ${endTime - startTime}ms`);
    return privateKeyPem;

  };

  const handleEncryptPassword = (pass: string) => {
    const encrypted = encryptPassword(PUBLIC_KEY_PEM, pass);
    setEncryptedPassword(encrypted);
  }

  const handleDecryptPassword = (encrypted: string) => {
    const localPEM = handleGeneratePrivateKeyPem(newPassword);
    if (!localPEM) return;

    const decrypted = decryptPassword(localPEM, encrypted);
    alert(decrypted);
    // setDecryptedPassword(decrypted);
  }

  return <main>
    {/* <PasswordGenerator setPassword={setPassword} password={password} /> */}
    {/* <input type="text" onChange={(e) => setPassword(e.target.value)} />
    <p>Password Before Encription: {password}</p>
    <button onClick={() => handleGenerateKeyPair()}>GENERATE</button>
    <p>Private: {privateKeyPem}</p>
    <p>Public: {publicKeyPem}</p> */}
    <h3>MASTER PASSWORD</h3>
    <input type="text" value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }} />
    <br />
    <br />
    <button onClick={() => handleGeneratePrivateKeyPem(newPassword)}>GENERATE PRIVATE KEY</button>
    {/* <p>Private: {newPrivateKeyPem}</p>
    <p>Public: {newPublicKeyPem}</p> */}
    <p>{equal ? "EQUAL" : "DIFFER"}</p>
    <p>{correctPassword ? "CORRECT" : "INCORRECT"}</p>
    {/* <div style={{ display: "flex", gap: "1rem" }}>
      <p style={{ width: "200px" }}>{password}</p>
      <button onClick={() => handleEncryptPassword(password)}>ENCRYPT</button>
      <p
        style={{
          width: "200px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",

        }}
      >{encryptedPassword}</p>
      <button onClick={() => handleDecryptPassword(encryptedPassword)}>DECRYPT</button>
      <p style={{ width: "200px" }}>{decryptedPassword}</p>
    </div> */}
    <table>
      <thead>
        <td>WebSite</td>
        <td>Password</td>
        <td></td>
      </thead>
      <tbody>
        {PASSWORDS.map((pass) => {
          return <tr>
            <td>{pass.website}</td>
            <td><p style={ENCRYPTED_PASSWORD_STYLE}>{pass.password}</p></td>
            <button onClick={() => handleDecryptPassword(password)}> DECRYPT </button>
          </tr>
        })}
      </tbody>
    </table>


  </main>;
}
export default App;
