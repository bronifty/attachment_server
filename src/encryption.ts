
export interface Encryption {
    /**
     * Encrypt a file for storage at the provided file_path 
     * @param user_id The id of the user who owns the attachment
     * @param file_path The file path to encrypt
     */
    encrypt(user_id: string, file_path: string): Promise<string>;

    /**
     * Decrypt a file for usage at the provided file_path
     * @param user_id The id of the user who owns the attachment
     * @param encrypted_file_path The file path to encrypt
     */
    decrypt(user_id: string, encrypted_file_path: string): Promise<string>;
}