export interface ColumnInterface {
    id: 'website' | 'password' | 'Decrypt';
    label: string;
    minWidth?: number;
    maxWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

export const columns: readonly ColumnInterface[] = [
    { id: 'website', label: 'Website', minWidth: 170 },
    { id: 'password', label: 'Encrypted Password', minWidth: 100 },
    {
        id: 'Decrypt',
        label: 'Decrypt',
        minWidth: 170,
    },
];

export interface PasswordInterface {
    id: number;
    website: string;
    password: string;
}