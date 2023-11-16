import request from "supertest";
import * as controllers from "../../src/controllers/level.controller.js";
import * as services from "../../src/services/level.services.js";

jest.mock("../../src/services/level.services.js");

beforeEach(() => {
    jest.clearAllMocks();
});

describe('getLevels', () => {
    test('should return an array with all levels', async () => {
        const mockRequest = {};
        const mockResponse = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
        const mockLevels = [
            {
                id: 1,
                name: "1",
            },
            {
                id: 2,
                name: "2",
            }
        ];

        services.getAllLevels = jest.fn().mockResolvedValue(mockLevels);
        
        await controllers.getLevels(mockRequest, mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(mockLevels);
    });

    test('should return a 500 error if getAllLevels throws', async () => {
        const mockRequest = {};
        const mockResponse = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
        const mockError = new Error('test error');

        services.getAllLevels = jest.fn().mockRejectedValue(mockError);
        
        await controllers.getLevels(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError.message });
    });
});
