export class Application {
  constructor(
    id,
    proposal_id,
    student_id,
    status,
    submission_date
  ) {
    this.id = id;
    this.proposal_id = proposal_id;
    this.student_id = student_id;
    this.status = status;
    this.submission_date = submission_date;
  }

  static fromApplicationsResult(result) {
    return new Application(
      result.id,
      result.proposal_id,
      result.student_id,
      result.status,
      result.submission_date
    );
  }

  serialize = () => {
    return {
      id: this.id,
      proposal_id: this.proposal_id,
      student_id: this.student_id,
      status: this.status,
      submission_date: this.submission_date,
    };
  }
}
