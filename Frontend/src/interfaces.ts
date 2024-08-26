export interface ColumnInterface {
  id: "website" | "password" | "Decrypt";
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

export const columns: readonly ColumnInterface[] = [
  { id: "website", label: "Website", minWidth: 170 },
  { id: "password", label: "Encrypted Password", minWidth: 100 },
  {
    id: "Decrypt",
    label: "Decrypt",
    minWidth: 170,
  },
];

export interface PasswordInterface {
  website: string;
  password: string;
  id: string | number;
  username: string;
}

export interface UserDataCookiesInterface {
  username: string;
  publicKey: string;
  salt: string;
}
