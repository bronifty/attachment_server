import { ImageScaler } from '../image_scaler';
import { PreviewGenerator } from '../preview_generator'

export class ImagePreviewGenerator implements PreviewGenerator {
    private readonly scaler: ImageScaler;
    private readonly MAX_WIDTH_PX = 250;

    constructor(scaler: ImageScaler) {
        this.scaler = scaler;
    }

    generate(filename: string): Promise<string> {
        return this.scaler.scale(filename, this.MAX_WIDTH_PX);
    }
}