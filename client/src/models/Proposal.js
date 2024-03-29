// Supervisor class definition
class Supervisor {
  constructor(id, name, surname, email, cod_group) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.cod_group = cod_group;
  }

  // Static method to create a Supervisor object from JSON
  static fromJson = (json) => {
    return new Supervisor(
      json.id,
      json.name,
      json.surname,
      json.email,
      json.cod_group
    );
  };

  // Static method to create a Supervisor object from a result
  static fromProposalsResult = (result) => {
    return new Supervisor(
      result.id,
      result.name,
      result.surname,
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
    title_degree,
    level,
    supervisor_id,
    notes,
    cod_group,
    title_group,
    required_knowledge,
    supervisorsInfo, // Array of supervisor information
    keyword_names,
    thesis_request_status,
    thesis_request_status_date,
    thesis_request_change_note
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.notes = notes;
    this.expiration_date = expiration_date;
    this.level = level;
    this.cod_degree = cod_degree;
    this.title_degree = title_degree;
    this.supervisor_id = supervisor_id;
    this.cod_group = cod_group;
    this.title_group = title_group;
    this.required_knowledge = required_knowledge;
    this.supervisorsInfo = supervisorsInfo.map(Supervisor.fromJson); // Map supervisor info to Supervisor objects
    this.keyword_names = keyword_names;
    this.thesis_request_status = thesis_request_status;
    this.thesis_request_status_date = thesis_request_status_date;
    this.thesis_request_change_note = thesis_request_change_note;
  }

  serialize = () => {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      expiration_date: this.expiration_date,
      cod_degree: this.cod_degree,
      title_degree: this.title_group,
      level: this.level,
      supervisor_id: this.supervisor_id,
      notes: this.notes,
      cod_group: this.cod_group,
      title_group: this.title_group,
      required_knowledge: this.required_knowledge,
      supervisorsInfo: this.supervisorsInfo.map((supervisor) =>
        supervisor.serialize()
      ), // Serialize supervisor info
      keyword_names: this.keyword_names,
      thesis_request_status: this.thesis_request_status,
      thesis_request_status_date: this.thesis_request_status_date,
      thesis_request_change_note: this.thesis_request_change_note,
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
      json.title_degree,
      json.level,
      json.supervisor_id,
      json.notes,
      json.cod_group,
      json.title_group,
      json.required_knowledge,
      json.supervisorsInfo, // Pass array of supervisor info directly
      json.keyword_names,
      json.thesis_request_status,
      json.thesis_request_status_date,
      json.thesis_request_change_note
    );
  };

  static fromProposalsResult = (result) => {
    return new Proposal(
      result.id,
      result.title,
      result.description,
      result.expiration_date,
      result.cod_degree,
      result.title_degree,
      result.level,
      result.supervisor_id,
      result.notes,
      result.cod_group,
      result.title_group,
      result.required_knowledge,
      result.supervisorsInfo, // Pass array of supervisor info directly
      result.keyword_names,
      result.thesis_request_status,
      result.thesis_request_status_date,
      result.thesis_request_change_note
    );
  };
}
