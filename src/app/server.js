import http from 'node:http';
import { handleDecrypt } from '../features/decrypt/decryptHandler.js';

const port = 3000;

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    console.log(`Request ${pathname}`);

    try {
        if (req.method == 'POST' && pathname == `/api/decrypt`) {
            const data = await handleDecrypt(req, res);
            let resData = {};
            resData["data"] = data;
            resData["size"] = data.length;
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