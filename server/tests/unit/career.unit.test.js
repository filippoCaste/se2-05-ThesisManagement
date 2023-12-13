import * as controllers from "../../src/controllers/career.controller.js";
import * as services from "../../src/services/career.services.js";

jest.mock("../../src/services/career.services.js");

beforeEach(() => {
    jest.clearAllMocks();
});

describe('getCareerByStudentId', () => {
    test('should return 400 if studentId is not provided', async () => {
        const req = { params: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await controllers.getCareerByStudentId(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Student id is required.' });
    });

    test('should return 400 if studentId is not a number', async () => {
        const req = { params: { studentId: 'abc' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await controllers.getCareerByStudentId(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Student id must be a number.' });
    });

    test('should return 200 if studentId is a number', async () => {
        const req = { params: { studentId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await controllers.getCareerByStudentId(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('should return 500 if getStudentCareer throws an error', async () => {
        const req = { params: { studentId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        services.getStudentCareer.mockImplementation(() => {
            throw new Error('Error getting student career.');
        });
        await controllers.getCareerByStudentId(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error getting student career.' });
    });
});

describe('uploadFile', () => {
    test('should return 400 if file is not provided', async () => {
        const req = { file: null };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await controllers.uploadFile(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'File is required.' });
    });

    test('should return 400 if file is not a pdf', async () => {
        const req = { file: { mimetype: 'application/json' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await controllers.uploadFile(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'File must be a pdf.' });
    });

    test('should return 200 if file is a pdf', async () => {
        const req = { file: { mimetype: 'application/pdf' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await controllers.uploadFile(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
});

describe('getFile', () => {
    test('should return 400 if studentId is not provided', async () => {
        const req = { params: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await controllers.getFile(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Student id is required.' });
    });

    test('should return 400 if studentId is not a number', async () => {
        const req = { params: { studentId: 'abc' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await controllers.getFile(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Student id must be a number.' });
    });

    test('should return 400 if applicationId is not provided', async () => {
        const req = { params: { studentId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await controllers.getFile(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Application id is required.' });
    });

    test('should return 400 if applicationId is not a number', async () => {
        const req = { params: { studentId: 1, applicationId: 'abc' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await controllers.getFile(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Application id must be a number.' });
    });

    test('should return 200 if studentId and applicationId are numbers', async () => {
        const req = { params: { studentId: 318082, applicationId: 19 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        services.getStudentCV.mockImplementation(() => {
            return { fileUrl: 'http://localhost:3001/students_CV/s318082_19_CV.pdf' };
        });
        await controllers.getFile(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('should return 404 if studentId and applicationId are numbers but file is not found', async () => {
        const req = { params: { studentId: 318082, applicationId: 19 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        services.getStudentCV.mockImplementation(() => {
            return null;
        });
        await controllers.getFile(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('should return 500 if getStudentCV throws an error', async () => {
        const req = { params: { studentId: 1, applicationId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        services.getStudentCV.mockImplementation(() => {
            throw new Error('Error getting student cv.');
        });
        await controllers.getFile(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error getting student cv.' });
    });

});