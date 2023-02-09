/**
 * Escape uploaded file name
 * @param {string} str
 */
export const escapeFileName = (str: string): string =>
  str.replace(/[!'~$&()%*><]/g, '').replace(/ /g, '_');
