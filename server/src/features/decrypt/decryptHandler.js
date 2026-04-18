import crypto from 'crypto';
import { readFile } from 'node:fs/promises';
import { getParsedJsonReq } from '../../shared/lib/parseReqData.js';
import { formatHexToInt } from '../../shared/lib/formatter.js';

export class Decrypter {
    privateKey = '';

    async getPrivateKey() {
        try {
            this.privateKey = await readFile('./storage/private.pem', 'utf-8');
            console.log('Private key was successfuly read');
        } catch(err) {
            console.error(err);
        }
    }

    async signDataBase64(data) {
        if (!this.privateKey) {
            throw new Error(`Private key not loaded.`);
        }
        
        const sign = crypto.createSign('SHA256');
        sign.update(data);
        sign.end();
        
        const signature = sign.sign(this.privateKey, 'hex');
        const dataStr = Buffer.from(signature, 'hex').toString('base64');
        return dataStr;
    }

    async signDataHex(data) {
        if (!this.privateKey) {
            throw new Error(`Private key not loaded.`);
        }
        
        const sign = crypto.createSign('SHA256');
        sign.update(data);
        sign.end();
        
        const signature = sign.sign(this.privateKey, 'hex');
        return signature;
    }
}

export async function handleDecrypt(req, res) {
    const decrypter = new Decrypter();
    await decrypter.getPrivateKey();

    const jsonData = await getParsedJsonReq(req);
    const string = jsonData["string"];
    const dataHex = Buffer.from(string.replace(/\s+/g, ''), 'hex');
    
    const signature = await decrypter.signDataHex(dataHex);
    const data = await formatHexToInt(signature);
    
    let resData = {};
    resData["data"] = data;
    resData["size"] = data.length;

    res.writeHead(200, { 'Content-type': 'application/json'});
    res.end(JSON.stringify(resData));
}