import { readFile } from 'node:fs/promises';
export async function AddUser(user) {
    const data = await readFile('../../../storage/users.json', 'utf-8')
}