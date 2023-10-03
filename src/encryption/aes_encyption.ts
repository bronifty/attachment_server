import { Encryption } from '../encryption'
import { Attachment } from '../attachment'
import { KeyStore } from '../key_store';
import { promisify } from 'util';

import * as crypto from 'crypto'
import * as fs from 'fs'

import { pipeline as pipeline_callback } from 'stream';

const pipeline = promisify(pipeline_callback);

export class AesEncryption implements Encryption {
    private keystore: KeyStore;
    
    private readonly IV = ":zGOlhg)nOwmg&}h+w.F9EDd<'n]_u7^'En0!FTHK!bcq0u%%>}$GwFLVq1jx^";
    private readonly ENCRYPTION_METHOD = 'aes256';

    constructor(keystore: KeyStore) {
        this.keystore = keystore;
    }
    
    async encrypt(user_id: string, file_path: string): Promise<string> {
        const iv = this.get_iv();
        const key = await this.get_key(user_id);
        const cipher = crypto.createCipheriv(this.ENCRYPTION_METHOD, key, iv);

        const encrypted_file = file_path + ".enc";

        const read_stream = fs.createReadStream(file_path);
        const write_stream = fs.createWriteStream(encrypted_file);

        await pipeline(read_stream, cipher, write_stream);
        return encrypted_file;
    }

    async decrypt(user_id: string, file_path: string): Promise<string> {
        const iv = this.get_iv();
        const key = await this.get_key(user_id);
        const cipher = crypto.createDecipheriv(this.ENCRYPTION_METHOD, key, iv);

        const decencrypted_file = file_path + ".dec";

        const read_stream = fs.createReadStream(file_path);
        const write_stream = fs.createWriteStream(decencrypted_file);

        await pipeline(read_stream, cipher, write_stream);
        return decencrypted_file;
    }

    private get_iv() {
        return crypto.createHash('sha512')
            .update(this.IV)
            .digest('hex')
            .substring(0, 16)
    }

    private async get_key(user_id: string) {
        return crypto.createHash('sha512')
            .update(await this.keystore.key_for_user(user_id))
            .digest('hex')
            .substring(0, 16);
    }
}