export class User {
  constructor(id, surname, name, email) {
    this.id = id;
    this.surname = surname;
    this.name = name;
    this.email = email;
  }

  serialize = () => {
    return {
      id: this.id,
      surname: this.surname,
      name: this.name,
      email: this.email,
    };
  };

  static fromJson = (json) => {
    return new User(json.id, json.surname, json.name, json.email);
  };
}

export class Student extends User {
  constructor(id, surname, name, email, gender, nationality, cod_degree, enrollment_year) {
    super(id, surname, name, email);
    this.gender = gender;
    this.nationality = nationality;
    this.cod_degree = cod_degree;
    this.enrollment_year = enrollment_year;
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
  constructor(id, surname, name, email, cod_group, cod_department) {
    super(id, surname, name, email);
    this.cod_group = cod_group;
    this.cod_department = cod_department;
  }

  serialize = () => {
    return {
      ...super.serialize(),
      cod_group: this.cod_group,
      cod_department: this.cod_department,
    };
  };

  static fromJson = (json) => {
    return new Professor(
      json.id,
      json.surname,
      json.name,
      json.email,
      json.cod_group,
      json.cod_department
    );
  };
}
