import * as controllers from "../../src/controllers/application.controller.js";
import * as services from "../../src/services/application.services.js";
import * as proposals from "../../src/services/proposal.services.js";
import * as teacher from "../../src/services/teacher.services.js";
import { sendNotificationApplicationDecision, sendEmailToTeacher } from "../../src/services/notification.services.js";
import { sendEmail } from "../../src/emailService/sendEmail.js";

beforeEach(() => {
    jest.clearAllMocks();
});

jest.mock('../../src/services/application.services.js', () => ({
    createApplicationInDb: jest.fn(),
    getApplicationsByProposalId: jest.fn(),
    changeStatus: jest.fn(),
}));

jest.mock('../../src/services/proposal.services.js', () => ({
    getProposalInfoByID: jest.fn(),
}));

jest.mock('../../src/services/teacher.services.js', () => ({
    getTeacherById: jest.fn(),
}));

jest.mock('../../src/emailService/sendEmail.js', () => ({
    sendEmail: jest.fn(),
}));

jest.mock('../../src/services/notification.services.js', () => ({
    sendNotificationApplicationDecision: jest.fn(),
    sendEmailToTeacher: jest.fn()
}));

describe('createApplication', () => {
    it('should return 400 if proposal_id is missing', async () => {
        const req = { body: { student_id: '123', submission_date: '2023-05-15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        sendEmail.mockImplementation(() => {});

        await controllers.createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Request should contain a proposal_id' });
        expect(sendEmail).not.toHaveBeenCalled();
    });

    it('should return 400 if student_id is missing', async () => {
        const req = { body: { proposal_id: '123', submission_date: '2023-05-15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        sendEmail.mockImplementation(() => {});

        await controllers.createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Request should contain a student_id' });
        expect(sendEmail).not.toHaveBeenCalled();
    });

    it('should return 400 if submission_date is not in YYYY-MM-dd format', async () => {
        const req = { body: { student_id: '123', proposal_id: '123', submission_date: '2023/05/15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        sendEmail.mockImplementation(() => {});

        await controllers.createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Request should contain a submission_date and be in the format YYYY-MM-dd' });
        expect(sendEmail).not.toHaveBeenCalled();
    });

    it('should return 400 if submission_date is missing', async () => {
        const req = { body: { student_id: '123', proposal_id: '123', submission_date: '2023/05/15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        sendEmail.mockImplementation(() => {});

        await controllers.createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Request should contain a submission_date and be in the format YYYY-MM-dd' });
        expect(sendEmail).not.toHaveBeenCalled();
    });

    it('should return 200 if everything is OK', async () => {
        const req = { body: { student_id: '123', proposal_id: '123', submission_date: '2023-05-15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      
        proposals.getProposalInfoByID.mockImplementation(() => {
            return {
              title: "title",
              supervisor_id: 5,
            };
          });
          teacher.getTeacherById.mockImplementation(() => {
              return {
                  email: "email@example.com",
              };
          });
          sendEmail.mockImplementation(() => {});
          services.createApplicationInDb.mockImplementation(() => {
              return {
                  id: 1,
                  proposal_id: 123,
                  student_id: 123,
                  status: "submitted",
                  submission_date: "2023-05-15",
              };
          });
          
          await controllers.createApplication(req, res);
  
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
              id: 1,
              proposal_id: 123,
              student_id: 123,
              status: 'submitted',
              submission_date: '2023-05-15',
          });
      });
  
      it('should return 500 if an error occurs during database operation', async () => {
          // Mock createApplicationInDb to throw an error
          services.createApplicationInDb.mockRejectedValue(new Error('Database error'));
          const req = { body: { proposal_id: '456', student_id: '123', submission_date: '2023-05-15' } };
          const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
          await controllers.createApplication(req, res);
  
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
      });
  
  });
  /*
  describe("sendEmailToTeacher", () => {
    test("should send an email to the teacher", async () => {
      const mockApplication = {
        id: 2,
        proposal_id: 123,
        student_id: 321,
        submission_date: "2023-05-15",
      };
      const mockProposal = {
        title: "Title of the proposal",
        supervisor_id: 5,
      };
      const mockTeacher = {
        email: "email@example.com",
        name: "John",
      };
      proposals.getProposalInfoByID.mockResolvedValue(mockProposal);
      teacher.getTeacherById.mockResolvedValue(mockTeacher);
      sendEmail.mockImplementation(() => {});
  
      await sendEmailToTeacher(mockApplication);
  

      expect(sendEmail).toHaveBeenCalledWith(
        mockTeacher.email,
        "New application for your proposal",
        expect.any(String)
      );
    });
  
    test("should return if proposal is not found", async () => {
      const mockApplication = {
        proposal_id: 123,
        student_id: 321,
        submission_date: "2023-05-15",
      };
      const mockTeacher = {
        email: "email@example.com",
      };
      proposals.getProposalInfoByID.mockResolvedValue(null);
  
      await sendEmailToTeacher(mockApplication, mockTeacher);
  
      expect(teacher.getTeacherById).not.toHaveBeenCalled();
      expect(sendEmail).not.toHaveBeenCalled();
    });
  
    test("should return if teacher is not found", async () => {
      const mockApplication = {
        proposal_id: 123,
        student_id: 321,
        submission_date: "2023-05-15",
      };
      const mockProposal = {
        title: "title",
      };
      const mockTeacher = {
        email: "email@example.com",
      };
      proposals.getProposalInfoByID.mockResolvedValue(mockProposal);
      teacher.getTeacherById.mockResolvedValue(null);
  
      await sendEmailToTeacher(mockApplication, mockTeacher);
  
      expect(sendEmail).not.toHaveBeenCalled();
    });
  
    test("should log error", async () => {
      const mockApplication = {
        proposal_id: 123,
        student_id: 321,
        submission_date: "2023-05-15",
      };
      const mockTeacher = {
        email: "email@example.com",
      };
      proposals.getProposalInfoByID.mockRejectedValue(new Error("error"));
      console.log = jest.fn();
  
  
      await sendEmailToTeacher(mockApplication, mockTeacher);
  
      expect(teacher.getTeacherById).not.toHaveBeenCalled();
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });
  */
  
  describe('getApplicationsProposalId',  () => {
  
    test("Incorrect fields", async () => {
    const req = { body: { status: undefined }, params: { applicationId: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    sendNotificationApplicationDecision.mockImplementation(() => {});

    await controllers.changeStatusOfApplication(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Incorrect fields" });
    expect(sendNotificationApplicationDecision).not.toHaveBeenCalled();
    });
});

test("should return 400 if status is not valid", async () => {
    const req = { body: { status: "other" }, params: { applicationId: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    sendNotificationApplicationDecision.mockImplementation(() => {});

    await controllers.changeStatusOfApplication(req, res);


    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Incorrect fields" });
    expect(sendNotificationApplicationDecision).not.toHaveBeenCalled();
});

test("should return 404 if proposal is not found", async () => {
    const req = { 
        body: { status: "accepted" }, params: { applicationId: 1 },
        user: { id: 1 }
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    services.changeStatus.mockImplementation(() => {throw 404});
    sendNotificationApplicationDecision.mockImplementation(() => {});

    await controllers.changeStatusOfApplication(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Proposal not found" });
    expect(sendNotificationApplicationDecision).not.toHaveBeenCalled();
});

test("should return 403 if user is not the supervisor of the proposal", async () => {
    const req = { 
        body: { status: "accepted" }, params: { applicationId: 1 },
        user: { id: 1 } 
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    services.changeStatus.mockImplementation(() => {throw 403});
    sendNotificationApplicationDecision.mockImplementation(() => {});
    
    await controllers.changeStatusOfApplication(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "You cannot access this resource" });
    expect(sendNotificationApplicationDecision).not.toHaveBeenCalled();
});

test("should return 500 if an error occurs during database operation", async () => {
    const req = { 
        body: { status: "accepted" }, params: { applicationId: 1 },
        user: { id: 1 }
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    services.changeStatus.mockImplementation(() => {throw Error("Database error")});
    sendNotificationApplicationDecision.mockImplementation(() => {});

    await controllers.changeStatusOfApplication(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    expect(sendNotificationApplicationDecision).not.toHaveBeenCalled();
});

test("should return 204 if everything is OK", async () => {
    const req = { 
        body: { status: "accepted" }, params: { applicationId: 1 },
        user: { id: 1 }
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
    services.changeStatus.mockResolvedValue(true);
    sendNotificationApplicationDecision.mockImplementation(() => {});
    
    await controllers.changeStatusOfApplication(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(sendNotificationApplicationDecision).toHaveBeenCalled();
});
