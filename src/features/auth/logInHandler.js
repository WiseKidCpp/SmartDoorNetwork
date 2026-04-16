import { getParsedJsonReq } from "../../shared/lib/parseReqData.js";

export async function handleLogIn(req, res) {
    const jsonData = await getParsedJsonReq(req, res);
    const email = jsonData["email"];
    const password = jsonData["password"];

    
}