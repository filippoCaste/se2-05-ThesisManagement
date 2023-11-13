export class User {
  constructor(data) {
    this.id = data.id;
    this.surname = data.surname;
    this.name = data.name;
    this.email = data.email;
    this.token = data.token;
  }

  serialize = () => {
    return {
      id: this.id,
      surname: this.surname,
      name: this.name,
      email: this.email,
      token: this.token,
    };
  };

  static fromJson = (json) => {
    return new User(json.id, json.surname, json.name, json.email, json.token);
  };
}

export class Student extends User {
  constructor(data) {
    super(data);
    this.gender = data.gender;
    this.nationality = data.nationality;
    this.cod_degree = data.cod_degree;
    this.enrollment_year = data.enrollment_year;
  }

  serialize = () => {
    return {
      ...super.serialize(),
      gender: this.gender,
      nationality: this.nationality,
      cod_degree: this.cod_degree,
      enrollment_year: this.enrollment_year,
    };
  };

  static fromJson = (json) => {
    return new Student(
      json.id,
      json.surname,
      json.name,
      json.email,
      json.gender,
      json.nationality,
      json.cod_degree,
      json.enrollment_year
    );
  };
}

export class Professor extends User {
  constructor(data) {
    super(data);
    this.cod_group = data.cod_group;
    this.cod_department = data.cod_department;
    this.group_name = data.group_name;
  }

  serialize = () => {
    return {
      ...super.serialize(),
      cod_group: this.cod_group,
      cod_department: this.cod_department,
      group_name: this.group_name,
    };
  };

  static fromJson = (json) => {
    return new Professor(
      json.id,
      json.surname,
      json.name,
      json.email,
      json.cod_group,
      json.cod_department,
      json.group_name
    );
  };
}
