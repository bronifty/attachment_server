
export interface ImageScaler {
    /**
     * Scales an image to a max_width
     * 
     * @param filename The name of the input image
     * @param max_width The max width in pixels
     * @returns the output filename, scaled
     */
    scale(filename: string, max_width: number): Promise<string>;

    /**
     * Returns whether the image scaler supports scaling the given mime type
     * @param mime_type The mime type
     * @returns True if the scaler can scale the image
     */
    supported(mime_type: string): boolean;
}