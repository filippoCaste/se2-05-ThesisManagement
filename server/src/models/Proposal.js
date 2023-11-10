export class Proposal {
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
    keyword_names,
    keyword_types
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
    this.keyword_names = keyword_names;
    this.keyword_types = keyword_types;
  }

  // Used to send the Proposals object to the client
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
      keyword_names: this.keyword_names,
      keyword_types: this.keyword_types,
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
      json.level,
      json.supervisor_id,
      json.notes,
      json.cod_group,
      json.required_knowledge,
      json.keyword_names,
      json.keyword_types
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
      result.keyword_names,
      result.keyword_types
    );
  }
}
