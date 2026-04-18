import { setTimeout } from 'node:timers/promises';

const serverAddr = 'http://127.0.0.1:3030';
const paths = ["/api/signup", "/api/signin", "/api/decrypt", "/api/refresh"];
const SIGN_UP = 0;
const SIGN_IN = 1;
const DECRYPT = 2;
const REFRESH = 3;

let accessToken = '';
let refreshToken = '';

async function Sleep(ms) {
    await setTimeout(ms);
}

async function post(path, type) {
    try {
        let reqData = {};
        if (type == SIGN_UP || type == SIGN_IN) {
            reqData["password"] = "sdf";
            reqData["email"] = "sdfdsaf";
        } else if (type == DECRYPT) {
            reqData["string"] = "hss";
        } else if (type == REFRESH) {
            reqData["refreshtoken"] = refreshToken;
        }

        const response = await fetch(serverAddr + path, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(reqData)
        });
        
        const resData = await response.json();
        if (!response.ok) {
            console.log(`Error: ${resData["error"]}`);
            if (type != SIGN_IN && type != SIGN_UP && type != REFRESH) {
                await post(paths[REFRESH], REFRESH);
            }
            return;
        }

        if (type == SIGN_UP || type == SIGN_IN || type == REFRESH) {
            console.log(`Access token: ${resData["token"]["access"]}`);
            console.log(`Refresh token: ${resData["token"]["refresh"]}`);
            accessToken = resData["token"]["access"];
            refreshToken = resData["token"]["refresh"];
            return;
        }

        console.log(resData["data"]);
    } catch (err) {
        console.error(err);
    }
}

await post(paths[SIGN_UP], SIGN_UP);
if (!accessToken) {
    await post(paths[SIGN_IN], SIGN_IN);
}
while (true) {
    await Sleep(5000);
    await post(paths[DECRYPT], DECRYPT);
}