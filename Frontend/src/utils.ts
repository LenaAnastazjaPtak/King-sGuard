export const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY----- MIHfMA0GCSqGSIb3DQEBAQUAA4HNADCByQKBwQDhpc64mdnAWjRuRbFQz0gaAgUU VEgpubchsKOvsjdHiAWleUzzjXMJU5scejA/3SgKyqGKowNMvZhnxsQ8M276gnNb zYahgZ3+z+XLcmZujydWQLon8Yhhvvb2SncBPcmHpaiMdfF4L7tvxJde2nsneIvZ 413RpSQXf1Kr1fb6iRcCWwX0zf+dIEJltiGpb5+Txp4QeCJnKISMDD1m2SmHmUQJ ZO+QRkcoSZ3t8aNVjNIqZiQ3WHxlIxPC5lGC8oMCAwEAAQ== -----END PUBLIC KEY-----`;
export const SALT =
  "d8732102cfdcd8757ebce0d4728b3e4eae8b85b2b3d0586e2572c63f53aea686";

export const isEmailValid = (email: string) => {
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return emailRegex.test(email);
};
