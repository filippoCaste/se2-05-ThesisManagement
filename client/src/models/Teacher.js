export class Teacher {
  constructor(id, name, surname, email, password, cod_degree, cod_group) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
    this.cod_degree = cod_degree;
    this.cod_group = cod_group;
  }

  // Used to send the Teacher object to the client
  serialize = () => {
    return {
      id: this.id,
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      cod_degree: this.cod_degree,
      cod_group: this.cod_group,
    };
  };

  // Used to retrieve the Teacher object from client object
  static fromJson = (json) => {
    return new Teacher(
      json.id,
      json.name,
      json.surname,
      json.email,
      json.password,
      json.cod_degree,
      json.cod_group
    );
  };

  static fromTeachersResult = (result) => {
    return new Teacher(
      result.id,
      result.name,
      result.surname,
      result.email,
      result.password,
      result.cod_degree,
      result.cod_group
    );
  };
}
