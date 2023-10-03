import { PreviewGenerator } from '../preview_generator'

export class DocumentPreviewGenerator implements PreviewGenerator {

    generate(filename: string): Promise<string> {
        // Not implemented
        return Promise.resolve(filename);
    }
}