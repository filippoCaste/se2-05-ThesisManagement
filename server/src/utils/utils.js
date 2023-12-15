export function isValidDateFormat(dateString) {
    // Check if the date string matches the 'YYYY-MM-DD' format using a regular expression
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    if (!dateRegex.test(dateString)) {
      console.log("The input date is not correct")
      return false; // Date format doesn't match 'YYYY-MM-DD'
    }

    // Check if the date is a valid date using the Date object
    const date = new Date(dateString);
    
    // Check if the parsed date is valid and the year, month, and day values match the input
    return (
      !isNaN(date.getTime()) &&
      date.getFullYear() === parseInt(dateString.substring(0, 4), 10) &&
      date.getMonth() + 1 === parseInt(dateString.substring(5, 7), 10) &&
      date.getDate() === parseInt(dateString.substring(8, 10), 10)
    );
    }

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
  const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  for(let email of values) {
    if(!regex.test(String(email).toLowerCase())) {
      return false;
    }
  }
  return true;
}