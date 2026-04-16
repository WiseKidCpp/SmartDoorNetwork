import { setTimeout } from 'node:timers/promises';

const serverAddr = 'http://127.0.0.1:3000';

async function Sleep(ms) {
    await setTimeout(ms);
}

async function getData() {
    try {
        let reqData = {};
        reqData["string"] = "88 42 07 36 BF 4B 29 82 96 4F C1 4A AC 07 5F 65 41 2A 66 88 33 05 A5 27 9A A2 2C 43 E1 96 70 85 15 03 9E DF D2 76 8B 8B 8B 84 34 67 5C 75 20 B6 AE 43 5C 00 C4 95 0A BD 96 C3 C8 C6 3C BE 83 80 5A 61 B3 BB 8D 47 09 C2 C4 2C 3E 6B 5A 78 55 6C 83 72 32 82 F2 03 50 4B 57 60 AD D5 23 9E 49 8D D2 F0 BC 05 E0 B3 47 22 42 4F 18 D8 61 BB C3 29 09 A7 60 6B 67 1C CC 33 EA 9D 4F F4 22 C0 8E 5A";

        const response = await fetch(serverAddr + '/api/decrypt', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(reqData)
        });
        
        const resData = await response.json();
        if (!response.ok) {
            console.log(`Error: ${resData["error"]}`);
            return;
        }

        console.log(resData["data"]);
    } catch (err) {
        console.error(err);
    }
}

while (true) {
    await Sleep(5000);
    await getData();
}