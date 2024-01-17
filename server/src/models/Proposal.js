export class Proposal {
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
    keyword_names,
    keyword_types,
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
    this.keyword_names = keyword_names;
    this.keyword_types = keyword_types;
    this.thesis_request_status = thesis_request_status;
    this.thesis_request_status_date = thesis_request_status_date;
    this.thesis_request_change_note = thesis_request_change_note;
  }

  // Used to send the Proposals object to the client
  serialize = () => {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      expiration_date: this.expiration_date,
      cod_degree: this.cod_degree,
      title_degree: this.title_degree,
      level: this.level,
      supervisor_id: this.supervisor_id,
      notes: this.notes,
      cod_group: this.cod_group,
      title_group: this.title_group,
      required_knowledge: this.required_knowledge,
      keyword_names: this.keyword_names,
      keyword_types: this.keyword_types,
      thesis_request_status: this.thesis_request_status,
      thesis_request_status_date: this.thesis_request_status_date,
      thesis_request_change_note: this.thesis_request_change_note,
    };
  };

  // Used to retrieve the Proposals object from client object
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
      json.keyword_names,
      json.keyword_types,
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
      result.keyword_names,
      result.keyword_types,
      result.thesis_request_status,
      result.thesis_request_status_date,
      result.thesis_request_change_note
    );
  };
}
