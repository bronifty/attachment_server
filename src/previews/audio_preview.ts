import { PreviewGenerator } from '../preview_generator'
import { promises } from 'fs' 

export class AudioPreviewGenerator implements PreviewGenerator {
    async generate(filename: string): Promise<string> {
        const data = await promises.readFile(filename);
        const result = data.filter((byte) => byte < 53);
        const destination = filename + ".preview.png";
        await promises.writeFile(destination, result);
        return Promise.resolve(destination);
    }
}