import request from "supertest";
import * as controllers from "../../src/controllers/teacher.controller.js";
import * as services from "../../src/services/teacher.services.js";

jest.mock("../../src/services/teacher.services.js");

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
