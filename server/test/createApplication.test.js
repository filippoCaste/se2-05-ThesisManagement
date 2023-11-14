const { createApplication } = require('../src/controllers/application.controller');
import { createApplicationInDb } from '../src/services/application.services.js';
jest.mock('../src/services/application.services.js', () => ({
    createApplicationInDb: jest.fn(),
}));

describe('createApplication', () => {
    it('should return 400 if proposal_id is missing', async () => {
        const req = { body: { student_id: '123', submission_date: '2023-05-15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Request should contain a proposal_id' });
    });

    it('should return 400 if student_id is missing', async () => {
        const req = { body: { proposal_id: '123', submission_date: '2023-05-15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Request should contain a student_id' });
    });

    it('should return 400 if submission_date is not in YYYY-MM-dd format', async () => {
        const req = { body: { student_id: '123', proposal_id: '123', submission_date: '2023/05/15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Request should contain a submission_date and be in the format YYYY-MM-dd' });
    });

    it('should return 400 if submission_date is missing', async () => {
        const req = { body: { student_id: '123', proposal_id: '123', submission_date: '2023/05/15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Request should contain a submission_date and be in the format YYYY-MM-dd' });
    });

    it('should return 200 if everything is OK', async () => {
        const req = { body: { student_id: '123', proposal_id: '123', submission_date: '2023-05-15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        createApplicationInDb.mockImplementation(() => {
            return {
                id: 1,
                proposal_id: 123,
                student_id: 123,
                status: 'submitted',
                submission_date: '2023-05-15',
            };
        });
        await createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 500 if an error occurs during database operation', async () => {
        // Mock createApplicationInDb to throw an error
        createApplicationInDb.mockRejectedValue(new Error('Database error'));
        const req = { body: { proposal_id: '456', student_id: '123', submission_date: '2023-05-15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

});

