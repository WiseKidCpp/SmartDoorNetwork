export class User {
    constructor(id, email, passwordHash) {
        this.id = id;
        this.email = email;
        this.password = passwordHash;
    }
}