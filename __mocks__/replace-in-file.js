// Mock for replace-in-file package
/* global jest */
const replaceInFile = jest.fn().mockResolvedValue({
  hasChanged: true,
  numReplacementsTotal: 1
});

module.exports = {
  replaceInFile
};
