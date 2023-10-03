
export interface KeyStore {
    /**
     * Fetch the encryption key for a user id
     * 
     * @param userId The user id
     * @return A promise which results to the secret key
     */
    key_for_user(userId: string): Promise<string>;
}