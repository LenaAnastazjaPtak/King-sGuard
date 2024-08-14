import forge from 'node-forge';

// KEY_LENGTH = 2048;
// const KEY_LENGTH = 2048;
const KEY_LENGTH = 1536;

export const comparePemKeys = (key1: string, key2: string) => {
    return forge.pki.privateKeyToPem(forge.pki.privateKeyFromPem(key1)) === forge.pki.privateKeyToPem(forge.pki.privateKeyFromPem(key2));
}

export const generateKeyPairFromString = (baseString: string) => {
    // Użyj PBKDF2, aby wygenerować deterministyczny seed na podstawie hasła
    const salt = 'some-fixed-salt'; // Stała wartość soli
    const iterations = 10000;
    const seed = forge.pkcs5.pbkdf2(baseString, salt, iterations, 32);

    // Własny generator liczb pseudolosowych z seedem
    const prng = forge.random.createInstance();
    prng.seedFileSync = (count: number) => {
        return seed.substring(0, count);
    };

    // Generuj parę kluczy RSA
    const keyPair = forge.pki.rsa.generateKeyPair({
        bits: KEY_LENGTH,
        e: 0x10001,
        prng: prng
    });

    const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
    const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);

    return { privateKeyPem, publicKeyPem };
};
export const verifyKeyPair = (publicKeyPem: string, privateKeyPem: string): boolean => {
    try {
        // Załaduj klucz publiczny
        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

        // Załaduj klucz prywatny
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

        // Wiadomość do przetestowania
        const testMessage = 'TestMessage123';

        // Zaszyfruj wiadomość przy użyciu klucza publicznego
        const encrypted = publicKey.encrypt(testMessage, 'RSA-OAEP', {
            md: forge.md.sha256.create()
        });

        // Odszyfruj wiadomość przy użyciu klucza prywatnego
        const decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP', {
            md: forge.md.sha256.create()
        });

        // Porównaj wiadomość przed i po procesie szyfrowania/odszyfrowania
        return testMessage === decrypted;
    } catch (error) {
        console.error('Nie poprawne hasło');
        return false;
    }
};


export const encryptPassword = (publicKeyPem: string, password: string): string => {
    // Konwersja klucza publicznego PEM do obiektu
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    // Szyfrowanie hasła za pomocą klucza publicznego
    const encryptedPassword = publicKey.encrypt(password, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
    });

    // Zwracamy zaszyfrowane hasło zakodowane w base64
    return forge.util.encode64(encryptedPassword);
};

export const decryptPassword = (privateKeyPem: string, encryptedPasswordBase64: string): string => {
    // Konwersja klucza prywatnego PEM do obiektu
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

    // Dekodowanie zaszyfrowanego hasła z base64
    const encryptedPassword = forge.util.decode64(encryptedPasswordBase64);

    // Odszyfrowanie hasła za pomocą klucza prywatnego
    const decryptedPassword = privateKey.decrypt(encryptedPassword, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
    });

    return decryptedPassword;
};