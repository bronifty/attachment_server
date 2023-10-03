import { Storage } from '../storage'
import { Attachment } from '../attachment'
import { randomUUID } from 'crypto';
import { copyFile } from 'fs/promises';

export class WebDavStorage implements Storage {
    private uri: string;
    private authorization_key: string;

    constructor(uri: string, authorization_key: string) {
        this.uri = uri;
        this.authorization_key = authorization_key;
    }
    
    async upload(attachment: Attachment): Promise<string> {
        const result = randomUUID();
        await copyFile(attachment.local_path, `uploads/${result}`); 

        if (attachment.preview_local_path) {
            await copyFile(attachment.preview_local_path, `uploads/${result}_preview`); 
        }

        return Promise.resolve(result);
    }

    download(attachment_id: string): Promise<Attachment> {
        // Not implemented

        return Promise.resolve({
            user_id: '06abdc33-bb22-4a27-b3a8-06b90faf9b34',
            message_id: 'fb234a6c-6ec8-47a7-9372-42df41889e21',
            local_path: '9h9934j5bh34-document.docx',
        });
    }
}