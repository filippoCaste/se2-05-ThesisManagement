// Supervisor class definition
class Supervisor {
  constructor(id, name, email, cod_group) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.cod_group = cod_group;
  }

  // Static method to create a Supervisor object from JSON
  static fromJson = (json) => {
    return new Supervisor(json.id, json.name, json.email, json.cod_group);
  };

  // Static method to create a Supervisor object from a result
  static fromProposalsResult = (result) => {
    return new Supervisor(
      result.id,
      result.name,
      result.email,
      result.cod_group
    );
  };
}

// Proposal class definition with supervisor information
export default class Proposal {
  constructor(
    id,
    title,
    description,
    expiration_date,
    cod_degree,
    level,
    supervisor_id,
    notes,
    cod_group,
    required_knowledge,
    supervisorsInfo // Array of supervisor information
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.notes = notes;
    this.expiration_date = expiration_date;
    this.level = level;
    this.cod_degree = cod_degree;
    this.supervisor_id = supervisor_id;
    this.cod_group = cod_group;
    this.required_knowledge = required_knowledge;
    this.supervisorsInfo = supervisorsInfo.map(Supervisor.fromJson); // Map supervisor info to Supervisor objects
  }

  serialize = () => {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      expiration_date: this.expiration_date,
      cod_degree: this.cod_degree,
      level: this.level,
      supervisor_id: this.supervisor_id,
      notes: this.notes,
      cod_group: this.cod_group,
      required_knowledge: this.required_knowledge,
      supervisorsInfo: this.supervisorsInfo.map((supervisor) =>
        supervisor.serialize()
      ), // Serialize supervisor info
    };
  };

  // Used to retrieve the Proposal object from client object
  static fromJson = (json) => {
    return new Proposal(
      json.id,
      json.title,
      json.description,
      json.expiration_date,
      json.cod_degree,
      json.level,
      json.supervisor_id,
      json.notes,
      json.cod_group,
      json.required_knowledge,
      json.supervisorsInfo // Pass array of supervisor info directly
    );
  };

  static fromProposalsResult = (result) => {
    return new Proposal(
      result.id,
      result.title,
      result.description,
      result.expiration_date,
      result.cod_degree,
      result.level,
      result.supervisor_id,
      result.notes,
      result.cod_group,
      result.required_knowledge,
      result.supervisorsInfo // Pass array of supervisor info directly
    );
  };
}
