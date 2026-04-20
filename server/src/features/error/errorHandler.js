export async function handleErrorNotFound(req, res) {
    let resData = {};
    resData["error"] = "Not found";
    res.writeHead(404, { 'Content-type': 'application/json'});
    res.end(JSON.stringify(resData));
}

export async function handleInternalServerError(req, res) {
    res.writeHead(500, { 'Content-type': 'application/json'});
    let resData = {};
    resData["error"] = "Internal server error";
    res.end(JSON.stringify(resData));
}

export async function handleIncorrectData(req, res) {
    res.writeHead(400, { 'Content-type': 'application/json'});
    let resData = {};
    resData["error"] = "Incorrect";
    res.end(JSON.stringify(resData));
}