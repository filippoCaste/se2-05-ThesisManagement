export class User {
  constructor(id, email, name, surname, role) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.surname = surname;
    this.role = role;
  }

  // Used to send the user object to the client
  serialize = () => {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      surname: this.surname,
      role: this.role,
    };
  };

  // Used to retrieve the user object from client object
  static fromJson = (json) => {
    return new User(json.id, json.email, json.name, json.surname, json.role);
  };
}
