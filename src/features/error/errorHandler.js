export async function handleErrorNotFound(req, res) {
    let resData = {};
    resData["error"] = "Not found";
    res.writeHead(404, { 'Content-type': 'application/json'});
    res.end(JSON.stringify(resData));
}

export async function handleInternalServerError(req, res) {
    res.writeHead(500, { 'Content-type': 'application/json'});
    res.end(JSON.stringify({ error: err.message }));
}