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
  for(let text of values) {
    const value = text && text.trim();
    if (value === '' || !value) {
      console.log("The error is in value: " + text);
      return false;
    }
    return true;
  }
}

/**
 * Check whether the input values are not numbers or contains undefined values
 * @param {Array} values : array of input values to be checked
 * @returns `true` if the input is okay, `false` otherwise
 */
export function isNumericInputValid(values) {
  for(let number of values) {
    const value = number && parseInt(number);
    if(isNaN(value) || ! value || number != value.toString()) {
      console.log("The error is in value: " + number);
      return false;
    }
    return true;
  }
}