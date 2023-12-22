export default class ProposalRequest {
  constructor(
    id,
    student_id,
    teacher_id,
    title,
    description,
    notes,
    type,
    studentInfo,
    supervisorsInfo 
  ) {
    this.id = id;
    this.student_id = student_id;
    this.teacher_id = teacher_id;
    this.title = title;
    this.description = description;
    this.notes = notes;
    this.type = type;
    this.studentInfo = studentInfo; 
    this.supervisorsInfo = supervisorsInfo; 
  }

  serialize = () => {
    return {
      id: this.id,
      student_id: this.student_id,
      teacher_id: this.teacher_id,
      title: this.title,
      description: this.description,
      notes: this.notes,
      type: this.type,
      studentInfo: this.studentInfo,
      supervisorsInfo: this.supervisorsInfo 
    };
  };

  static fromJson = (json) => {
    return new ProposalRequest(
      json.id,
      json.student_id,
      json.teacher_id,
      json.title,
      json.description,
      json.notes,
      json.type,
      json.studentInfo,
      json.supervisorsInfo 
    );
  };

  static fromProposalRequestsResult = (result) => {
    return new ProposalRequest(
      result.id,
      result.student_id,
      result.teacher_id,
      result.title,
      result.description,
      result.notes,
      result.type,
      result.studentInfo,
      result.supervisorsInfo 
    );
  };
}
