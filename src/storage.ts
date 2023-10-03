import { Attachment } from './attachment'

export interface Storage {
    /**
     * Store an attachment
     * 
     * @param attachment The attachment to store
     * @return the attachment id
     */
    upload(attachment: Attachment): Promise<string>;

    /**
     * Retrieve the attachment from the storage server
     * @param attachment_id the attachment id
     */
    download(attachment_id: string): Promise<Attachment>
}