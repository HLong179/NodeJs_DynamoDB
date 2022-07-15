class User {
    constructor(firstName, lastName, role, gender, email, password, metadata) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.gender = gender;
        this.email = email;
        this.password = password;
        this.metadata = metadata;
    }
}

module.exports = {User};