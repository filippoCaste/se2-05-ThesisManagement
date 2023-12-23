import * as controllers from "../../src/controllers/group.controller.js";
import * as services from "../../src/services/group.services.js";

jest.mock("../../src/services/group.services.js");

beforeEach(() => {
    jest.clearAllMocks();
});

describe('getGroup', () => {
    test('should return an array with all groups', async () => {
        const mockRequest = {};
        const mockResponse = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
        const mockGroups = [
            {
                cod_group: 1,
                title_group: "group 1",
            },
            {
                cod_group: 2,
                title_group: "group 2",
            }
        ];

        services.getAllGroups = jest.fn().mockResolvedValue(mockGroups);

        await controllers.getGroups(mockRequest, mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(mockGroups);
    });

    test('should return an error if getGroups throws an exception', async () => {
        const mockRequest = {};
        const mockResponse = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
        const mockError = new Error("Error getting degrees");

        services.getAllGroups = jest.fn().mockRejectedValue(mockError);

        await controllers.getGroups(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError.message });
    });
});
