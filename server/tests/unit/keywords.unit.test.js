import request from "supertest";
import * as controllers from "../../src/controllers/keyword.controller.js";
import * as services from "../../src/services/keyword.services.js";

jest.mock("../../src/services/keyword.services.js");

beforeEach(() => {
    jest.clearAllMocks();
});

describe('getKeywords', () => {
    test('should return an array with all keywords', async () => {
        const mockRequest = {};
        const mockResponse = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
        const mockKeywords = [
            {
                id: 1,
                name: "Keyword 1",
            },
            {
                id: 2,
                name: "Keyword 2",
            }
        ];

        services.getAllKeywords = jest.fn().mockResolvedValue(mockKeywords);
        
        await controllers.getKeywords(mockRequest, mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(mockKeywords);
    });

    test('should return a 500 error if getAllKeywords throws', async () => {
        const mockRequest = {};
        const mockResponse = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
        const mockError = new Error('test error');

        services.getAllKeywords = jest.fn().mockRejectedValue(mockError);
        
        await controllers.getKeywords(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError.message });
    });
});
