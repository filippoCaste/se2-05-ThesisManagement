export class ProposalRequest {
  constructor(id, studentId, teacherId, title, description, notes, type) {
    this.id = id;
    this.studentId = studentId;
    this.teacherId = teacherId;
    this.title = title;
    this.description = description;
    this.notes = notes;
    this.type = type;
    this.studentInfo = null;
    this.supervisorsInfo = []; // Changed from supervisorsInfo
  }

  static fromProposalRequestsResult(result) {
    return new ProposalRequest(
      result.id,
      result.student_id,
      result.teacher_id,
      result.title,
      result.description,
      result.notes,
      result.type
    );
  }

  serialize() {
    return {
      id: this.id,
      studentId: this.studentId,
      teacherId: this.teacherId,
      title: this.title,
      description: this.description,
      notes: this.notes,
      type: this.type,
      studentInfo: this.studentInfo,
      supervisorsInfo: this.supervisorsInfo,
    };
  }

  setStudentInfo(info) {
    this.studentInfo = info;
  }

  addSupervisorInfo(supervisorInfo) {
    this.supervisorsInfo.push(supervisorInfo);
  }
}
