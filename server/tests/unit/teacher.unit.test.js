import * as controllers from "../../src/controllers/teacher.controller.js";
import * as services from "../../src/services/teacher.services.js";

beforeEach(() => {
    jest.clearAllMocks();
});

describe('getTeachers', () => {
    test('should return an array with all teachers', async () => {
        const mockRequest = {};
        const mockResponse = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
        const mockTeachers = [
            {
                teacher_id: 10000,
                name: "Marco",
                surname: "Torchiano",
                email: "d88@@polito.it",
                cod_group: 7,
                cod_department: "DAUIN"
            },
            {
                teacher_id: 10001,
                name: "Mario",
                surname: "Rossi",
                email: "d89@polito.it",
                cod_group: 7,
                cod_department: "DAUIN"
            }
        ];

        services.getAllTeachers = jest.fn().mockResolvedValue(mockTeachers);
        
        await controllers.getTeachers(mockRequest, mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(mockTeachers);
    });

    test('should return an error if getAllTeachers throws an exception', async () => {
        const mockRequest = {};
        const mockResponse = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
        const mockError = new Error("Error getting teachers");

        services.getAllTeachers = jest.fn().mockRejectedValue(mockError);

        await controllers.getTeachers(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError.message });
    });
});

describe("getTeacherId", () => {
    test('Valid teacher id', async () => {
        const request = { params: { id: 10000 } };
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        const teacherObj = {
            teacher_id: 10000,
            name: "Marco",
            surname: "Torchiano",
            email: "d88@@polito.it",
            cod_group: 7,
            cod_department: "DAUIN"
        };

        services.getTeacherById = jest.fn().mockResolvedValue(teacherObj);

        await controllers.getTeacherId(request, response);

        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(expect.any(Object));
    });

    test('Invalid teacher id', async () => {
        const request = { params: { id: 'abc' } };
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controllers.getTeacherId(request, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            error: 'Uncorrect id',
        });
    });

    test('Teacher not found', async () => {
        const request = { params: { id: '123' } };
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        services.getTeacherById = jest.fn().mockResolvedValue(null);
        await controllers.getTeacherId(request, response);

        expect(response.status).toHaveBeenCalledWith(404);
    });

    test('Internal server error', async () => {
        const request = { params: { id: '123' } };
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(response, 'json').mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        await controllers.getTeacherId(request, response);

        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledWith({
            error: 'Test error',
        });
    });
});