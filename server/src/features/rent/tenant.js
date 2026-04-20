import { getParsedJsonReq } from "../../shared/lib/parseReqData.js";
import { handleInternalServerError } from "../error/errorHandler.js";
import { readFile, writeFile } from 'node:fs/promises';

export async function handleNewTenant(req, res, user) {
    const jsonData = await getParsedJsonReq(req);
    try {
        const lockId = jsonData["id"];
        let rawData = await readFile('./storage/access.json', 'utf-8');
        let data;
        try { 
            data = JSON.parse(rawData);
        } catch(err) {
            data = {};
        }
        data[user.id] = lockId;
        console.log(`New owner!`);
        await writeFile('./storage/access.json', JSON.stringify(data, null, 4));
        res.writeHead(200, { 'Content-type': 'application/json'});
        res.end(JSON.stringify(resData));
    } catch(err) {
        await handleInternalServerError(req, res);
        return;
    }
}

export async function handleTenantData(req, res, user) {
    try {
        let rawData;
        try {
            rawData = await readFile('./storage/access.json', 'utf-8');
        } catch (err) {
            console.error(err);
        }
        let data;
        try { 
            data = JSON.parse(rawData);
        } catch(err) {
            data = {};
        }
        await writeFile('./storage/access.json', JSON.stringify(data, null, 4));
        res.writeHead(200, { 'Content-type': 'application/json'});
        let reqData = {};
        reqData["id"] = data[user.id];
        console.log(data[user.id]);
        res.end(JSON.stringify(reqData));
    } catch(err) {
        console.error(err);
        await handleInternalServerError(req, res);
        return null;
    }
}

export async function checkTenant(user, id) {
    try {
        let rawData = await readFile('./storage/access.json', 'utf-8');
        let data;
        try { 
            data = JSON.parse(rawData);
        } catch(err) {
            data = {};
        }
        if (data[user.id] == null) return null;
        if (data[user.id] != id) return null;
        return 1;
    } catch(err) {
        return null;
    }
}
