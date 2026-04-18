import { FindUser, FindUserEmail, NewUser } from "../../entities/user/userApi.js";
import { generateAccessToken, generateRefreshToken } from "../../shared/lib/jwt.js";
import { getParsedJsonReq } from "../../shared/lib/parseReqData.js";
import { handleInternalServerError } from "../error/errorHandler.js";

export async function handleSignIn(req, res) {
    const jsonData = await getParsedJsonReq(req, res);
    const email = jsonData["email"];
    const password = jsonData["password"];

    let user = await FindUser(email, password);
    if (user != null) {
        console.log(`New login: ${email}`);
        res.writeHead(200, { 'Content-type': 'application/json'});
        let resData = JSON.parse('{}');
        resData["data"] = "Success";
        resData["token"] = {};
        resData["token"]["access"] = await generateAccessToken(user);
        resData["token"]["refresh"] = await generateRefreshToken(user);
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

    let user = await FindUserEmail(email);
    if (user) {
        res.writeHead(380, { 'Content-type': 'application/json' });
        let resData = JSON.parse('{}');
        resData["error"] = "User with this email already exists";
        res.end(JSON.stringify(resData));
        return;
    }

    try {
        user = await NewUser(email, password);
        console.log(`New user: ${email}`);
        res.writeHead(200, { 'Content-type': 'application/json'});
        let resData = JSON.parse('{}');
        resData["data"] = "Success";
        resData["token"] = {};
        resData["token"]["access"] = await generateAccessToken(user);
        resData["token"]["refresh"] = await generateRefreshToken(user);
        res.end(JSON.stringify(resData));
    } catch(err) {
        console.error(err);
        await handleInternalServerError(req, res);
    }
}