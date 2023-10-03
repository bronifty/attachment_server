
import { KeyStore } from "../key_store";

export class KeyService implements KeyStore {
    public constructor(uri: String) {
    }

    key_for_user(userId: string): Promise<string> {
        // Not implemented
        return Promise.resolve('');
    }

    
}