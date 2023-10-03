import { app } from "../src/app";
import supertest from 'supertest'
import chalk from 'chalk'
import { existsSync, readFileSync } from "fs";
import { clear_uploads, getToken } from "./common";

const fileContents = Buffer.from('750571886823813384301395890');

clear_uploads();
const token = getToken();

async function run_test() {
    const test = supertest(app);
    const response = await test.post('/attachment/upload')
        .set('Authorization', 'Bearer ' + token)
        .attach('upload', fileContents, 'file.mp3');
        
    if (response.status != 200) {
        console.log("Unknown error occurred. If you need to reset the app you can use `git checkout .`");
        console.error(response.body);
        return;
    }

    const attachment_id = response.body.attachment_id;
    const preview_path = `uploads/${attachment_id}_preview`;
    if (!existsSync(preview_path)) {
        console.log(`Preview for attachment ${attachment_id} ${chalk.red('does not exist')}! Did you register the AudioGenerator preview generator?`);
        return;
    }

    const contents = readFileSync(preview_path);
    console.log(`Success! Preview for file generated!`);
    console.log('Enter the contents of the file into the site for aesthetic points: ' + chalk.blue(contents));
}

run_test();