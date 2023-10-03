
export interface PreviewGenerator {
    /**
     * Makes a preview image from the file
     * 
     * @param filename The file to create a thumbnail for
     * @return A promise which results to the image generated
     */
    generate(filename: string): Promise<string>;
}