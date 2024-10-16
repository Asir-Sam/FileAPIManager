const xlsx = require('xlsx');
const path = require('path');

function readXlsxFile(fileName) {
  const filePath = path.join(__dirname, 'data', fileName);
  const workbook = xlsx.readFile(filePath);

  const firstSheetName = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[firstSheetName];

  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  return jsonData;
}

module.exports = readXlsxFile;
