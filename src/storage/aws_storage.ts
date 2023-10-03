process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1';

import { Storage } from '../storage'
import { Attachment } from '../attachment'
import { Encryption } from '../encryption'
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';

export class AwsStorage implements Storage {
    private readonly encryption: Encryption;
    private readonly s3: AWS.S3;

    public constructor(encryption: Encryption, aws_access_key_id: string, aws_secret_access_key: string) {
        this.encryption = encryption;
        AWS.config.credentials = new AWS.Credentials(aws_access_key_id, aws_secret_access_key);
        this.s3 = new AWS.S3({apiVersion: '2006-03-01'});
    }

    async upload(attachment: Attachment): Promise<string> {
        const local_path = await this.encryption.encrypt(attachment.user_id, attachment.local_path);

        let preview_local_path = null; 
        if (attachment.preview_local_path) {
            preview_local_path = await this.encryption.encrypt(attachment.user_id, attachment.local_path)
        }

        const attachment_id = uuidv4();
        await this.upload_to_s3(attachment_id, attachment.message_id, local_path, preview_local_path);

        return attachment_id;
    }

    async download(attachment_id: string): Promise<Attachment> {
        const attachment = await this.fetch_attachment_s3(attachment_id);
        attachment.local_path = await this.encryption.decrypt(attachment.user_id, attachment.local_path);

        if (attachment.preview_local_path) {
            attachment.preview_local_path = await this.encryption.decrypt(attachment.user_id, attachment.preview_local_path);
        }

        return attachment;
    }

    async upload_to_s3(attachment_id: string, message_id: string, local_path: string, preview_local_path: string | null): Promise<void> {
        const main_upload = this.s3.upload({
            Bucket: 'uploads',
            Key: attachment_id,
            Metadata: {
                'message_id': message_id
            },
            Body: fs.createReadStream(local_path)
        });

        const uploads = [ main_upload.promise() ];

        if (preview_local_path) {
            const preview_upload = this.s3.upload({
                Bucket: 'previews',
                Key: attachment_id,
                Metadata: {
                    'message_id': message_id
                },
                Body: fs.createReadStream(preview_local_path)
            });

            uploads.push(preview_upload.promise());
        }
        
        await Promise.all(uploads);
    }

    fetch_attachment_s3(attachment_id: string): Promise<Attachment> {
        // Not implemented 

        return Promise.resolve({
            user_id: '1b8c3e14-066a-420d-b349-3e8ea702d9f5',
            message_id: '36766e12-e0e8-4c85-bc31-ec5811f5b5e6',
            local_path: '453g34fg56-document.docx',
            preview_local_path: '453g34fg56-preview-document.jpg',
        });
    }
}