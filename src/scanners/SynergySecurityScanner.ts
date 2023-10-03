
import { Scanner, IssuesDetected } from '../scanner'
import { promises } from 'fs' 

/**
 * Scan file for viruses
 */
export class SynergySecurityScanner implements Scanner {
    private readonly signatures = [
        'EA66D8CFE5',
        '0A721BC6B1',
        'D0822A9',
        'A326FFB2C15',
        '705549F9D7',
        'D4703F05C3',
        '5B81207313B',
        'B0806AB372C',
        'E36DE7C2',
        '76798C60B7E',
        '0B42903154A',
        'BCC07501B'
    ]

    /**
     * Scan the file for viruses. Returns whether an issue was detected
     * 
     * @param filename The upload to scan
     * @returns A promise that resolves to true if an issue was detected, False if no issue was detected
     */
    async scan(filename: string): Promise<IssuesDetected> {
        const data = await promises.readFile(filename);

        for (let signature of this.signatures) {
            if (data.indexOf(signature) !== -1) {
                return signature;
            }
        }

        return undefined;
    }
}
