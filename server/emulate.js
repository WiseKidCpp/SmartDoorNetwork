import { setTimeout } from 'node:timers/promises';

const serverAddr = 'http://127.0.0.1:3000';
const paths = ["/api/signup", "/api/signin"];
const SIGN_UP = 0;
const SIGN_IN = 1;

async function Sleep(ms) {
    await setTimeout(ms);
}

async function post(path, type) {
    try {
        let reqData = {};
        if (type == SIGN_UP || type == SIGN_IN) {
            reqData["password"] = "piddd";
            reqData["email"] = "gmail";
        }

        const response = await fetch(serverAddr + path, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(reqData)
        });
        
        const resData = await response.json();
        if (!response.ok) {
            console.log(`Error: ${resData["error"]}`);
            return;
        }

        console.log(resData["data"]);
    } catch (err) {
        console.error(err);
    }
}

while (true) {
    await Sleep(5000);
    await post(paths[SIGN_UP], SIGN_UP);
    await Sleep(5000);
    await post(paths[SIGN_IN], SIGN_IN);
}