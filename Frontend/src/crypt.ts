import forge from 'node-forge';

// KEY_LENGTH = 2048;
// const KEY_LENGTH = 2048;
const KEY_LENGTH = 1536;

export const comparePemKeys = (key1: string, key2: string) => {
    return forge.pki.privateKeyToPem(forge.pki.privateKeyFromPem(key1)) === forge.pki.privateKeyToPem(forge.pki.privateKeyFromPem(key2));
}

export const generateKeyPairFromString = (baseString: string) => {
    const salt = 'some-fixed-salt';
    const iterations = 10000;
    const seed = forge.pkcs5.pbkdf2(baseString, salt, iterations, 32);

    const prng = forge.random.createInstance();
    prng.seedFileSync = (count: number) => {
        return seed.substring(0, count);
    };

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
        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
        const testMessage = 'TestMessage123';

        const encrypted = publicKey.encrypt(testMessage, 'RSA-OAEP', {
            md: forge.md.sha256.create()
        });

        // console.log('Encrypted message:', forge.util.encode64(encrypted));

        const decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP', {
            md: forge.md.sha256.create()
        });

        // console.log('Decrypted message:', decrypted);

        return testMessage === decrypted;
    } catch (error) {
        // console.error('Invalid RSAES-OAEP padding or other decryption error');
        // console.error(error);

        return false;
    }
};


export const encryptPassword = (publicKeyPem: string, password: string): string => {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encryptedPassword = publicKey.encrypt(password, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
    });
    return forge.util.encode64(encryptedPassword);
};



export const decryptPassword = (privateKeyPem: string, encryptedPasswordBase64: string): string => {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const encryptedPassword = forge.util.decode64(encryptedPasswordBase64);
    const decryptedPassword = privateKey.decrypt(encryptedPassword, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
    });
    return decryptedPassword;
};

export const verifyMasterPassword = (masterPassword: string, publicKeyPem: string): undefined | string => {
    if (masterPassword === "") return;

    const startTime = performance.now();
    const { privateKeyPem } = generateKeyPairFromString(masterPassword);

    const endTime = performance.now();
    if (!verifyKeyPair(publicKeyPem, privateKeyPem)) {
        console.error("INCORRECT MASTER PASSWORD");
        return;
    }
    console.log(`Time taken to generate private PEM: ${endTime - startTime}ms`);
    return privateKeyPem;
};