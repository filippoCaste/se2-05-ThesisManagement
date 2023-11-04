export class User {
  constructor(id, name, email, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }

  // Used to send the user object to the client
  serialize = () => {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
    };
  };

  // Used to retrieve the user object from client object
  static fromJson = (json) => {
    return new User(json.id, json.username, json.email, json.role);
  };
}
