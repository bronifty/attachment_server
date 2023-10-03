
import { ImageScaler } from '../image_scaler'

export class BrokenImageScaler implements ImageScaler {
    scale(filename: string, max_width: number): Promise<string> {
        return Promise.resolve(filename);
    }

    supported(mime_type: string): boolean {
        return false;
    }
}