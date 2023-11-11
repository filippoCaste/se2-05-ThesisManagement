export function isValidDateFormat(dateString) {
    // Check if the date string matches the 'YYYY-MM-DD' format using a regular expression
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  
    if (!dateRegex.test(dateString)) {
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