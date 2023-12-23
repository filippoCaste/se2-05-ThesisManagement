import * as controllers from '../../src/controllers/student.controller.js';
import * as services from '../../src/services/student.services.js';

beforeEach(() => {
    jest.clearAllMocks();
});

jest.mock('../../src/services/student.services.js', () => ({
    getStudentById: jest.fn(),
}));

describe('getStudentId', () => {
    test('should return student object if id is correct', async () => {
        const req = { params: { id: '1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        const student = { id: 1, name: 'John Doe' };
        services.getStudentById.mockResolvedValue(student);

        await controllers.getStudentId(req, res);

        expect(res.json).toHaveBeenCalledWith(student);
    });

    test('should return 404 error if student is not found', async () => {
        const req = { params: { id: '1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        services.getStudentById.mockResolvedValue(null);

        await controllers.getStudentId(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    test('should return 400 error if id is not a number', async () => {
        const req = { params: { id: 'abc' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await controllers.getStudentId(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Uncorrect id' });
    });

    test('should return 500 error if an error occurs', async () => {
        const req = { params: { id: '1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        const error = new Error('Database connection error');
        services.getStudentById.mockRejectedValue(error);

        await controllers.getStudentId(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
});