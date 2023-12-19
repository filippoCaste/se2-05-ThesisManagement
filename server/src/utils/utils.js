import validator from "validator";

/**
 * Check whether the input values are text or contains undefined values
 * @param {Array} values : array of input values to be checked
 * @returns `true` if the input is okay, `false` otherwise
 */
export function isTextInputValid(values) {
  if (!values || values.length === 0) {
    return false;
  }
  for (let text of values) {
    if (!text || typeof text !== "string" || text.trim() === "") {
      console.log("The error is in value: " + text);
      return false;
    }
  }
  return true;
}

/**
 * Check whether the input values are not numbers or contains undefined values
 * @param {Array} values : array of input values to be checked
 * @returns `true` if the input is okay, `false` otherwise
 */
export function isNumericInputValid(values) {
  for (let number of values) {
    const value = number && parseInt(number);
    if (!value || isNaN(value) || number != value.toString()) {
      console.log("The error is in value: " + number);
      return false;
    }
    return true;
  }
}

export function isEmailInputValid(values) {
  for(let email of values) {
    if(!validator.isEmail(email)) {
      return false;
    }
  }
  return true;
}