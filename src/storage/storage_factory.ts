import { Encryption } from "../encryption";
import { Storage } from "../storage"
import { AwsStorage } from "./aws_storage";
import { SftpStorage } from "./sftp_storage";
import { WebDavStorage } from "./webdav_storage";

interface SftpConfig {
    host: string;
    port: number;
    username: string;
    private_key: Buffer;
}

type SftpCompanies = {
    [company_id: string]: SftpConfig;
}

interface WebDavConfig {
    uri: string;
    authorization_key: string;
}

type WebDavCompanies = {
    [company_id: string]: WebDavConfig;
}

export interface StorageConfiguration {
    aws_access_key_id: string;
    aws_secret_access_key: string;

    sftp_companies: SftpCompanies;
    webdav_companies: WebDavCompanies;
}

export class StorageFactory {
    private readonly config: StorageConfiguration;
    private readonly encryption: Encryption;
    
    constructor (config: StorageConfiguration, encryption: Encryption) {
        this.encryption = encryption;
        this.config = config;
    }

    create_storage(company_id: string): Storage {
        if (this.config.sftp_companies[company_id]) {
            const config = this.config.sftp_companies[company_id];
            return new SftpStorage(config.host, config.port, config.username, config.private_key);
        }

        if (this.config.webdav_companies[company_id]) {
            const config = this.config.webdav_companies[company_id];
            return new WebDavStorage(config.uri, config.authorization_key);
        }

        return new AwsStorage(this.encryption, this.config.aws_access_key_id, this.config.aws_secret_access_key)
    }
}