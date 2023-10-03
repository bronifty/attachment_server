import { readdir, unlink } from 'fs'
import { join } from 'path';
import { JwtAuthentication } from "../src/authentication";

export function clear_uploads() {
    readdir('uploads', (err, files) => {
        if (err) throw err;
        
        for (const file of files) {
            if (file !== '.gitkeep') {
                unlink(join('uploads', file), (err) => {
                    if (err) throw err;
                });
            }
        }
    });
}

export function getToken() {
    return new JwtAuthentication().create_token({
        user_id: '75bf1ea7-774a-4c73-9f0d-f118994a83e2',
        company_id: '721b90a9-f340-450e-bbd5-d94406c555ab'
    });
}