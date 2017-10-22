/**
 * Calculate number of spaces at the beginning of a string. Tabs are treated 
 * as if were replaced by spaces with a tab stop of 4 characters based on the 
 * following rule; Thanks to Ashe (https://github.com/github/cmark/issues/59) 
 * for clarification:
 * 
 *    No. spacs = 4 - ( Tab Position % 4) 
 * 
 * @param {string} str 
 */
export const calculateSpaces = (str: string): number => {
  let result = 0
  const chars = str.split('')
  for (let index = 0; index < chars.length; index++) {
    const char = str[index]
    if (char.match(/\S/)) {
      // Oops! We've reached the first non-whitespace character, let's quit
      return result
    }
    if (char === '\t') {
      result += 4 - index % 4
    } else {
      result += 1
    }
  }
  return result
}
