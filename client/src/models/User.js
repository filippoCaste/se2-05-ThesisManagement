export default class User {
  constructor(id, username, email, role) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.role = role;
  }

  serialize = () => {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
    };
  };

  static fromJson = (json) => {
    return new User(json.id, json.name, json.email, json.role);
  };
}
