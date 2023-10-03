import { app } from "../src/app";
import supertest from 'supertest'
import chalk from 'chalk'
import { clear_uploads, getToken } from "./common";

const fileContents = Buffer.from('2AC6429ACD08ECF01476D4703F05C370BA9EC343E3C9F0A3E3120F81186158B1');

clear_uploads();
const token = getToken();

async function run_test() {
    const test = supertest(app);
    const response = await test.post('/attachment/upload')
        .set('Authorization', 'Bearer ' + token)
        .attach('upload', fileContents, 'file.txt');
        
    let regex = /Virus scanner detected issue: ([A-Z0-9]+)/;

    console.log()

    if (response.status == 200) {
        console.log(`Status: ${chalk.green(response.status)} ${chalk.red('Scanner did not find the issue')}.`);
        console.log('ThreatProtect was configured to be the scanner - not SynergySecurity. Did you update app.ts to use SynergySecurity always?');
        return;
    }
    else if (response.body.error && regex.test(response.body.error)) {
        const signature = regex.exec(response.body.error)?.[1];
        
        console.log(`Status: ${chalk.red(response.status)} { error: "${response.body.error}"}`);
        console.log();
        console.log(`${chalk.green('Success!')} Now that you configured SynergySecurity, it now correctly detects the issue with the signature.`);
        console.log(`Enter the virus signature on the website for aesthetic points: ${chalk.blue(signature)}`);
    }
    else {
        console.log("Unknown error occurred. If you need to reset the app you can use `git checkout .`");
        console.error(response.body);
    }

    debugger;
}

run_test();