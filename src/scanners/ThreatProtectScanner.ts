
import { Scanner, IssuesDetected } from '../scanner'

/**
 * Scan file for viruses
 */
export class ThreatProtectScanner implements Scanner {
    /**
     * Scan the file for viruses. Returns whether an issue was detected
     * 
     * @param filename The upload to scan
     * @returns A promise that resolves to true if an issue was detected, False if no issue was detected
     */
    scan(filename: string): Promise<IssuesDetected> {
        // Not implemented
        return Promise.resolve(undefined);
    }
}
