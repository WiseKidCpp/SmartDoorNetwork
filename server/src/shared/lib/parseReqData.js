export async function getParsedJsonReq(req) {
    try {
        let body = '';
        for await (const chunk of req) body += chunk;
        //console.log(`Body ${body}`);
        const res = await JSON.parse(body);
        return res;
    } catch(err) {
        console.error(err);
        return {};
    }
}