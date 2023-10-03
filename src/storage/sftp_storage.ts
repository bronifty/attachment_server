import { Storage } from '../storage'
import { Attachment } from '../attachment'
import sftp from 'ssh2-sftp-client';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class SftpStorage implements Storage {
    private readonly host: string;
    private readonly port: number;
    private readonly username: string;
    private readonly private_key: Buffer;
    private readonly client = new sftp();

    constructor(host: string, port: number, username: string, private_key: Buffer) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.private_key = private_key;
    }
    
    async upload(attachment: Attachment): Promise<string> {
        await this.client.connect({
            host: this.host,
            port: this.port,
            username: this.username,
            privateKey: this.private_key
        });

        const attachment_id = uuidv4();

        const main_upload = await this.client.fastPut(attachment.local_path, `./${attachment_id}`);
        const uploads = [ main_upload ];

        if (attachment.preview_local_path) {
            const preview_upload = await this.client.fastPut(attachment.preview_local_path, `./previews/${attachment_id}`);
            uploads.push(preview_upload);
        }

        await Promise.all(uploads);
        await this.client.end();

        return attachment_id;
    }

    download(attachment_id: string): Promise<Attachment> {
        // Not implemented

        return Promise.resolve({
            user_id: 'e64fb39d-2cc7-4056-b9a3-06db079e2e48',
            message_id: 'c03c4c45-a6a3-4b9e-af94-9962ed23f91f',
            local_path: '9h9934j5bh34-document.docx',
        });
    }
}