export async function formatHexToInt(text) {
    let nw = 0;
    const upperCase = text.toString().toUpperCase();
    let res = [];
    for (let i = 0; i < upperCase.length; i += 2) {
        const byte = parseInt(upperCase.substr(i, 2), 16);
        res.push(byte);
    }
    return res;
}