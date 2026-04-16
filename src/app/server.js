import http from 'node:http';
import { handleDecrypt } from '../features/decrypt/decryptHandler.js';
import { handleErrorNotFound, handleInternalServerError } from '../features/error/errorHandler.js';
import { handleLogIn } from '../features/auth/logInHandler.js';

const port = 3000;

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    try {
        if (req.method == 'POST' && pathname == `/api/decrypt`) {
            await handleDecrypt(req, res);
        } else if (req.method == 'POST' && pathname == `/api/login`) {
            await handleLogIn(req, res);
        }else {
            await handleErrorNotFound(req, res);
        }
    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            await handleInternalServerError(req, res);
        }
    }
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Running server on port: ${port}`);
});