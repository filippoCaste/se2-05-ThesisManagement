export class Student {
  constructor(
    id,
    name,
    surname,
    gender,
    nationality,
    email,
    cod_degree,
    enrollment_year
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.gender = gender;
    this.nationality = nationality;
    this.email = email;
    this.cod_degree = cod_degree;
    this.enrollment_year = enrollment_year;
    this.role = "student";
  }

  // Used to send the Student object to the client
  serialize = () => {
    return {
      id: this.id,
      name: this.name,
      surname: this.surname,
      gender: this.gender,
      nationality: this.nationality,
      email: this.email,
      cod_degree: this.cod_degree,
      enrollment_year: this.enrollment_year,
      role: this.role,
    };
  };

  // Used to retrieve the Student object from client object
  static fromResult = (result) => {
    return new Student(
      result.id,
      result.name,
      result.surname,
      result.gender,
      result.nationality,
      result.email,
      result.cod_degree,
      result.enrollment_year
    );
  };
}
