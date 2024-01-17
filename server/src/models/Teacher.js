export class Teacher {
  constructor(id, name, surname, email, cod_department, cod_group, group_name) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.cod_department = cod_department;
    this.cod_group = cod_group;
    this.group_name = group_name;
    this.role = "teacher";
  }

  // Used to send the Teacher object to the client
  serialize = () => {
    return {
      id: this.id,
      name: this.name,
      surname: this.surname,
      email: this.email,
      cod_department: this.cod_department,
      cod_group: this.cod_group,
      group_name: this.group_name,
      role: this.role,
    };
  };

  // Used to retrieve the Teacher object from client object
  static fromJson = (json) => {
    return new Teacher(
      json.id,
      json.name,
      json.surname,
      json.email,
      json.cod_department,
      json.cod_group
    );
  };

  static fromTeachersResult = (result) => {
    return new Teacher(
      result.id,
      result.name,
      result.surname,
      result.email,
      result.cod_department,
      result.cod_group,
      result.group_name,
    );
  };
}
