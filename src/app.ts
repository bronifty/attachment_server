import express, { Express, Request, Response } from 'express';
import multer from 'multer';
import { makeAuthenticate, JwtAuthentication, Authentication } from './authentication';
import { PreviewGeneratorFactory } from './previews/preview_factory';
import path from 'path';
import { Attachment } from './attachment';
import { UploadRequest } from './upload_request';
import { StorageConfiguration, StorageFactory } from './storage/storage_factory';
import { AesEncryption } from './encryption/aes_encyption';
import { KeyService } from './keystore/keyservice';
import { ImagePreviewGenerator } from './previews/image_preview';
import { VideoPreviewGenerator } from './previews/video_preview';
import { DocumentPreviewGenerator } from './previews/document_preview';
import { SynergySecurityScanner } from './scanners/SynergySecurityScanner';
import { ThreatProtectScanner } from './scanners/ThreatProtectScanner';
import { AudioPreviewGenerator } from './previews/audio_preview';
import { BrokenImageScaler } from './image_scaler/broken_image_scaler';

const upload = multer({ dest: 'uploads/' })

const auth = new JwtAuthentication();

const is_production = process.env.NODE_ENV === 'production';
const virus_scanner = is_production ? new ThreatProtectScanner() : new SynergySecurityScanner();

const keystore = new KeyService('https://keys.codeaesthetic.io');
const encryption = new AesEncryption(keystore);

const storage_config = loadStorageConfig();
const storage_factory = new StorageFactory(storage_config, encryption);

const image_scaler = new BrokenImageScaler();

const preview_factory = new PreviewGeneratorFactory();
const image_generator = new ImagePreviewGenerator(image_scaler);
preview_factory.register('image/jpg', image_generator);
preview_factory.register('image/png', image_generator);
preview_factory.register('image/gif', image_generator);
preview_factory.register('image/bmp', image_generator);

const document_generator = new DocumentPreviewGenerator();
preview_factory.register('application/vnd.openxmlformats-officedocument.wordprocessing­ml.document', document_generator);
preview_factory.register('application/pdf', document_generator);
preview_factory.register('text/plain', document_generator);

const video_generator = new VideoPreviewGenerator();
preview_factory.register('video/mp4', video_generator);
preview_factory.register('video/AV1', video_generator);
preview_factory.register('video/H264', video_generator);

export const app: Express = express();
const auth_required = makeAuthenticate(auth);

app.get('/attachment/{id}', async (req: Request, res: Response) => {
    try {
        const storage = storage_factory.create_storage(req.company_id);
        const attachment = await storage.download(req.params.id);
        res.sendFile(attachment.local_path);
    }
    catch (error) {
        res.status(400).send({ 'error': error });
    }
});

app.post('/attachment/upload', auth_required, upload.single('upload'), async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
        res.status(400).send({ 'error': 'No file' });
        return;
    }

    try {
        const storage = storage_factory.create_storage(req.company_id);
        const upload = new UploadRequest(preview_factory, storage, image_scaler, virus_scanner);
        
        const attachment: Attachment = { 
            local_path: file.path,
            user_id: req.user_id,
            message_id: req.body.message_id
        };

        const attachment_id = await upload.upload(attachment, file.mimetype);

        res.send({ attachment_id: attachment_id });
    } catch (error: any) {
        console.error(error)
        res.status(400).send({ 'error': error.toString() });
    }
});

app.get('/', (request: Request, response: Response) => {
    response.sendFile('index.html', { root: path.join(__dirname, '../../src/') });
})

function loadStorageConfig(): StorageConfiguration {
    return { 
        aws_access_key_id: '',
        aws_secret_access_key: '',
    
        sftp_companies: {
            "4eb56e82-2b8a-4774-a9e8-45ffa22a5eb5": {
                host: "10.0.0.1",
                port: 22,
                username: 'upload',
                private_key: Buffer.from('Not implemented'),
            }
        },
        webdav_companies: {
            '721b90a9-f340-450e-bbd5-d94406c555ab': {
                uri: 'https://try.codeaesthetic.io/webdav',
                authorization_key: 'ccGKN7w3E5G0PjoTk6mWRBvge2tVKa9bWKR'
            }
        }
    };
}