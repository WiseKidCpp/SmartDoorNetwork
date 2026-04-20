import 'dotenv/config';
import http from 'node:http';
import { handleDecrypt } from '../features/decrypt/decryptHandler.js';
import { handleErrorNotFound, handleIncorrectData, handleInternalServerError } from '../features/error/errorHandler.js';
import { NewUser } from '../entities/user/userApi.js';
import { handleSignIn, handleSignUp } from '../features/auth/authHandler.js';
import { authenticateToken, handleCheckToken, refreshTokens } from '../shared/lib/jwt.js';
import { handleNewTenant, handleTenantData } from '../features/rent/tenant.js';

const port = 3030;

function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    
    setCorsHeaders(res);

    if (req.method == 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    console.log(`Request: ${pathname}`);

    try {
        if (req.method == 'POST' && pathname == `/api/decrypt`) {
            if (await authenticateToken(req, res)) {
                console.log(`Provided access token is correct!`);
                await handleDecrypt(req, res);
            }
        } else if (req.method == 'POST' && pathname == `/api/signin`) {
            await handleSignIn(req, res);
        } else if (req.method == 'POST' && pathname == `/api/signup`) {
            await handleSignUp(req, res);
        } else if (req.method == 'POST' && pathname == `/api/refresh`) {
            await refreshTokens(req, res);
        } else if (req.method == 'POST' && pathname == `/api/newtenant`) {
            const user = await authenticateToken(req, res);
            if (user == null) return;
            await handleNewTenant(req, res, user);
        } else if (req.method == 'GET' && pathname == `/api/getid`) {
            const user = await authenticateToken(req, res);
            if (user == null) return;
            await handleTenantData(req, res, user);
        } else if (req.method == 'POST' && pathname == `/api/checktoken`) {
            await handleCheckToken(req, res);
        } else {
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