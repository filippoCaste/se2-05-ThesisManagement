import request from "supertest";
import * as controllers from "../../src/controllers/degree.controller.js";
import * as services from "../../src/services/degree.services.js";

jest.mock("../../src/services/degree.services.js");

beforeEach(() => {
    jest.clearAllMocks();
});

describe('getDegrees', () => {
    test('should return an array with all degrees', async () => {
        const mockRequest = {};
        const mockResponse = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
        const mockDegrees = [
            {
                cod_degree: 1,
                title_degree: "Degree 1",
            },
            {
                cod_degree: 2,
                title_degree: "Degree 2",
            }
        ];

        services.getAllDegrees = jest.fn().mockResolvedValue(mockDegrees);
        
        await controllers.getDegrees(mockRequest, mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(mockDegrees);
    });

    test('should return an error if getAllDegrees throws an exception', async () => {
        const mockRequest = {};
        const mockResponse = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
        const mockError = new Error("Error getting degrees");

        services.getAllDegrees = jest.fn().mockRejectedValue(mockError);

        await controllers.getDegrees(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError.message });
    });
});
