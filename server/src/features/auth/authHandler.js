import { FindUser, FindUserEmail, NewUser } from "../../entities/user/userApi.js";
import { getParsedJsonReq } from "../../shared/lib/parseReqData.js";
import { handleInternalServerError } from "../error/errorHandler.js";

export async function handleSignIn(req, res) {
    const jsonData = await getParsedJsonReq(req, res);
    const email = jsonData["email"];
    const password = jsonData["password"];

    let id = await FindUser(email, password);
    if (id != null) {
        res.writeHead(200, { 'Content-type': 'application/json'});
        let resData = JSON.parse('{}');
        resData["data"] = "Success";
        res.end(JSON.stringify(resData));
    } else {
        res.writeHead(401, { 'Content-type': 'application/json'});
        let resData = JSON.parse('{}');
        resData["error"] = "Incorrect credentials";
        res.end(JSON.stringify(resData));
    }
}

export async function handleSignUp(req, res) {
    const jsonData = await getParsedJsonReq(req, res);
    const email = jsonData["email"];
    const password = jsonData["password"];

    let id = await FindUserEmail(email);
    if (id) {
        res.writeHead(380, { 'Content-type': 'application/json' });
        let resData = JSON.parse('{}');
        resData["error"] = "User with this email already exists";
        res.end(JSON.stringify(resData));
        return;
    }

    try {
        await NewUser(email, password);
        res.writeHead(200, { 'Content-type': 'application/json'});
        let resData = JSON.parse('{}');
        resData["data"] = "Success";
        res.end(JSON.stringify(resData));
    } catch(err) {
        console.error(err);
        await handleInternalServerError(req, res);
    }
}