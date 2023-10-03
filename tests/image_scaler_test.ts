import { app } from "../src/app";
import supertest from 'supertest'
import chalk from 'chalk'
import { existsSync, readFileSync } from "fs";
import { clear_uploads, getToken } from "./common";
import sharp from "sharp";

const fileContents = Buffer.from('750571886823813384301395890');

clear_uploads();
const token = getToken();

async function run_test() {
    const test = supertest(app);
    const response = await test.post('/attachment/upload')
        .set('Authorization', 'Bearer ' + token)
        .attach('upload', readFileSync('files/injection_bubbles.jpg'), 'injection_bubbles.jpg');
        
    if (response.status != 200) {
        console.log("Unknown error occurred. If you need to reset the app you can use `git checkout .`");
        console.error(response.body);
        return;
    }

    const attachment_id = response.body.attachment_id;
    const attachment_path = `uploads/${attachment_id}`;
    if (!existsSync(attachment_path)) {
        console.log('Unknown error occurred, file was not uploaded. If you need to reset the app you can use `git checkout .`');
        console.error(response.body);
        return;
    }

    const metadata = await sharp(attachment_path).metadata();

    if (metadata.width !== 2500) {
        console.log(`Width: ${chalk.red(metadata.width)}, Height: ${metadata.height}`);
        console.log('It looks like the image was not resized. Check your new implementation');
    }
    else {
        console.log(`Width: ${chalk.green(metadata.width)}, Height: ${metadata.height}`);
        console.log(`${chalk.green('Success!')}! Your image was resized!`);
        console.log('Enter the width of the image into the site for aesthetic points: ' + chalk.blue(metadata.height));
    }

    const contents = readFileSync(attachment_path);
    
}

run_test();