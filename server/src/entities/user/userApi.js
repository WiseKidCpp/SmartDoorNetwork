import { readFile, writeFile } from 'node:fs/promises';
import { User } from '../../entities/user/userModel.js';

export async function NewUser(email, password) {
    let rawData = await readFile('./storage/users.json', 'utf-8');
    let data;
    try {
        data = JSON.parse(rawData);
    } catch (err) {
        data = {};
    }
    if (!data["userscount"]) {
        data["userscount"] = 0;
    }
    if (!data["users"]) {
        data["users"] = [];
    }
    const count = data["userscount"];
    const user = new User(count + 1, email, password);
    data["users"].push(user);
    data["userscount"] = count + 1;
    const res = JSON.stringify(data, null, 4);
    await writeFile('./storage/users.json', res)
    return user;
}

export async function FindUser(email, password) {
    let rawData = await readFile('./storage/users.json', 'utf-8');
    let data;
    try { 
        data = JSON.parse(rawData) 
    } catch(err) {
        data = {};
    }
    let user = null;
    if (!data["users"]) return null;
    for (let i = 0; i < data["users"].length; i++) {
        if (data["users"][i]["password"] == password && data["users"][i]["email"] == email) {
            user = data["users"][i];
            break;
        }
    }
    return user;
}

export async function FindUserEmail(email) {
    let rawData = await readFile('./storage/users.json', 'utf-8');
    let data;
    try { 
        data = JSON.parse(rawData) 
    } catch(err) {
        data = {};
    }
    let user = null;
    if (!data["users"]) return null;
    for (let i = 0; i < data["users"].length; i++) {
        if (data["users"][i]["email"] == email) {
            user = data["users"][i];
            break;
        }
    }
    return user;
}