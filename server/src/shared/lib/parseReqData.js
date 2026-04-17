export async function getParsedJsonReq(req) {
    let body = '';
    for await (const chunk of req) body += chunk;
    return await JSON.parse(body);
}