import http from 'node:http';
import { Decrypter } from './api/decryptHandler.js';
import { format } from 'node:path';

const port = 3000;

async function getParsedDataReq(req) {
    let body = '';
    for await (const chunk of req) {
        body += chunk;
    }
    return await JSON.parse(body);
}

async function formatHex1(text) {
    let nw = 0;
    const upperCase = text.toString().toUpperCase();
    let res = [];
    for (let i = 0; i < upperCase.length; i += 2) {
        const byte = parseInt(upperCase.substr(i, 2), 16);
        console.log(`Byte: ${byte}`);
        res.push(byte);
    }
    return res;
}

async function formatHex(text) {
    const upperCase = text.toString().toUpperCase();
    let res = '';
    for (let i = 0; i < upperCase.length; i++) {
        res += upperCase[i];
    }
    return res;
}

async function handleDecryptHex(req, res) {
    const decrypter = new Decrypter();
    await decrypter.getPrivateKey();

    const jsonData = await getParsedDataReq(req);
    const string = jsonData["string"];
    console.log(`String ${string}`);
    const dataHex = Buffer.from(string.replace(/\s+/g, ''), 'hex');
    
    const signature = await decrypter.signDataHex(dataHex);
    return await formatHex(signature);
}

async function handleDecrypt(req, res) {
    const decrypter = new Decrypter();
    await decrypter.getPrivateKey();

    const jsonData = await getParsedDataReq(req);
    const string = jsonData["string"];
    console.log(`String ${string}`);
    const dataHex = Buffer.from(string.replace(/\s+/g, ''), 'hex');
    
    const signature = await decrypter.signData(dataHex);
    return signature;
}


const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    console.log(`Request ${pathname}`);

    try {
        if (req.method == 'POST' && pathname == `/api/decrypt`) {
            const data = await handleDecryptHex(req, res);
            let resData = {};
            resData["data"] = data;
            console.log(`Signature ${data}`);
            res.writeHead(200, { 'Content-type': 'application/json'});
            res.end(JSON.stringify(resData));
        } else {
            let resData = {};
            resData["error"] = "Not found";
            res.writeHead(404, { 'Content-type': 'application/json'});
            res.end(JSON.stringify(resData));
        }
    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-type': 'application/json'});
            res.end(JSON.stringify({ error: err.message }));
        }
    }
    
});

async function startListen() {
    server.listen(port, '0.0.0.0', () => {
        console.log(`Running server on port: ${port}`);
    });
}

async function start() {
    await startListen();
}

await start();