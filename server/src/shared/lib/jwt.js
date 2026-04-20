import jwt from 'jsonwebtoken';
import { getParsedJsonReq } from './parseReqData.js';
import { readFile, writeFile } from 'node:fs/promises';
import crypto from 'node:crypto';
import { FindUserEmail } from '../../entities/user/userApi.js';

export async function generateAccessToken(user) {
    return jwt.sign(
        { id: user["id"], email: user["email"] },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );
}

export async function removeRefreshToken(email) {
    let rawData = await readFile('./storage/refresh.json', 'utf-8');
    let data;
    try { 
        data = JSON.parse(rawData) 
    } catch(err) {
        data = {};
    }
    let user = null;
    if (!data[email]) return null;
    data[email] = '';
    await writeFile('./storage/refresh.json', JSON.stringify(data));
    return 1;
}

export async function refreshTokens(req, res) {
    let jsonData = await getParsedJsonReq(req, res);
    let oldToken = jsonData["refreshtoken"];
    const email = await findRefreshToken(oldToken);
    if (!email) {
        res.writeHead(403, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid or expired refresh token' }));
        return null;
    }
    
    let user = await FindUserEmail(email);
    res.writeHead(200, { 'Content-type': 'application/json'});
    let resData = {};
    resData["token"] = {};
    resData["token"]["access"] = await generateAccessToken(user);
    resData["token"]["refresh"] = await generateRefreshToken(user);
    res.end(JSON.stringify(resData));
}

export async function findRefreshToken(token) {
    let rawData = await readFile('./storage/refresh.json', 'utf-8');
    let data;
    try { 
        data = JSON.parse(rawData) 
    } catch(err) {
        data = {};
    }
    let email = null;
    for (const [key, value] of Object.entries(data)) {
        console.log(key, value);
        if (value == token) {
            email = key;
            break;
        }
    }
    return email;
}

export async function checkRefreshToken(email, token) {
    let rawData = await readFile('./storage/refresh.json', 'utf-8');
    let data;
    try { 
        data = JSON.parse(rawData) 
    } catch(err) {
        data = {};
    }
    let user = null;
    if (!data[email]) return null;
    if (data[email] != token) return null;
    return email;
}

export async function generateRefreshToken(user, oldToken = null) {
    if (oldToken) {
        let res = await checkRefreshToken(user.email, oldToken);
        if (!res) return null;
    }

    await removeRefreshToken(user.email);

    const token = crypto.randomBytes(40).toString('hex');
    let rawData = await readFile('./storage/refresh.json', 'utf-8');
    let data;
    try { 
        data = JSON.parse(rawData) 
    } catch(err) {
        data = {};
    }
    data[user.email] = token;
    console.log(`New refresh token!`);
    await writeFile('./storage/refresh.json', JSON.stringify(data, null, 4));
    return token;
}

export async function authenticateToken(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.writeHead(401, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ error: 'No access token provided'}));
        return null;
    }

    try {
        const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        return user;
    } catch (err) {
        res.writeHead(403, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid or expired access token' }));
        return null;
    }
}