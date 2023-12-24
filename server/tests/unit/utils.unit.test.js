import { isTextInputValid, isNumericInputValid, isEmailInputValid } from "../../src/utils/utils.js";

describe("isTextInputValid", () => {
    it("should return false if the input is empty", () => {
        const values = [];
        expect(isTextInputValid(values)).toBe(false);
    });

    it("should return false if any value is not a string or is an empty string", () => {
        const values = ["text", true, "", 123];
        expect(isTextInputValid(values)).toBe(false);
    });

    it("should return true if all values are valid strings", () => {
        const values = ["text1", "text2", "text3"];
        expect(isTextInputValid(values)).toBe(true);
    });
});

describe("isNumericInputValid", () => {
    it("should return false if any value is not a number", () => {
        const values = [123, "456", null, undefined];
        expect(isNumericInputValid(values)).toBe(false);
    });

    it("should return true if all values are valid numbers", () => {
        const values = [123, '456', 789];
        expect(isNumericInputValid(values)).toBe(true);
    });

    it('should return false for invalid input: contains non-numeric value', () => {
        const input = ['12', 'abc', '56'];
        expect(isNumericInputValid(input)).toBe(false);
    });

    it('should return false for invalid input: contains undefined value', () => {
        const input = ['12', undefined, '56'];
        expect(isNumericInputValid(input)).toBe(false);
    });
});

describe("isEmailInputValid", () => {
    it("should return false if any email address is invalid", () => {
        const values = ["email1@example.com", "email2@invalid", "email3@example.com"];
        expect(isEmailInputValid(values)).toBe(false);
    });

    it("should return true if all email addresses are valid", () => {
        const values = ["email1@example.com", "email2@example.com", "email3@example.com"];
        expect(isEmailInputValid(values)).toBe(true);
    });
});
