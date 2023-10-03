import { ImageScaler } from "./image_scaler";
import { PreviewGeneratorFactory } from "./previews/preview_factory";
import { Scanner } from "./scanner";
import { Attachment } from './attachment'
import { Storage } from './storage'

export class UploadRequest {
    private readonly preview_factory: PreviewGeneratorFactory;
    private readonly storage: Storage;
    private readonly scaler: ImageScaler;
    private readonly scanner: Scanner;

    private readonly IMAGE_MAX_WIDTH_PX = 2500; 

    constructor(preview: PreviewGeneratorFactory, storage: Storage, scaler: ImageScaler, scanner: Scanner) {
        this.preview_factory = preview;
        this.storage = storage;
        this.scaler = scaler;
        this.scanner = scanner;
    }
    
    async upload(attachment: Attachment, mime_type: string): Promise<string> {
        const scan_result = await this.scanner.scan(attachment.local_path);
        if (scan_result) {
            throw Error("Virus scanner detected issue: " + scan_result);
        }

        if (this.scaler.supported(mime_type)) {
            attachment.local_path = await this.scaler.scale(attachment.local_path, this.IMAGE_MAX_WIDTH_PX);
        }

        const preview_generator = this.preview_factory.generate(mime_type);
        if (preview_generator) {
            attachment.preview_local_path = await preview_generator.generate(attachment.local_path);
        }

        return await this.storage.upload(attachment);
    };
}