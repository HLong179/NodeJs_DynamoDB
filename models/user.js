class User {
    constructor(pk, sk, firstName, lastName, role, gender, email, password, metadata) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.gender = gender;
        this.email = email;
        this.password = password;
        this.metadata = metadata;
        this.pk = pk;
        this.sk = sk;
    }
}

module.exports = {User};