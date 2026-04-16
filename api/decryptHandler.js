import crypto from 'crypto';
import { readFile } from 'node:fs/promises';

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

    async signData(data) {
        if (!this.privateKey) {
            throw new Error(`Private key not loaded.`);
        }
        
        const sign = crypto.createSign('SHA256');
        sign.update(data);
        sign.end();
        
        const signature = sign.sign(this.privateKey, 'hex');
        console.log(`SignatureSIGN: ${signature}`);
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