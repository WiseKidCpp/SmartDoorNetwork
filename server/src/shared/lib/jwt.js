import jwt from 'jsonwebtoken';
import { getParsedJsonReq } from './parseReqData.js';

export async function generateAccessToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );
}

export async function generateRefreshToken(user, oldToken = null) {
    if (oldToken) {
        //remove
    }

    const token = crypto.randomBytes(40).toSting('hex');
    //store token
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