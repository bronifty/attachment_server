import { ImageScaler } from '../image_scaler';
import { PreviewGenerator } from '../preview_generator'
import { DocumentPreviewGenerator } from './document_preview';
import { ImagePreviewGenerator } from './image_preview';
import { VideoPreviewGenerator } from './video_preview';

export class PreviewGeneratorFactory {
    private readonly generators = new Map<string, PreviewGenerator>();

    register(mime_type: string, generator: PreviewGenerator) {
        this.generators.set(mime_type, generator);
    }

    generate(mime_type: string) : PreviewGenerator | undefined {
        return this.generators.get(mime_type);
    }
}