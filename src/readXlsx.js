const xlsx = require('xlsx');
const path = require('path');

function readXlsxFile(fileName) {
  const filePath = path.join(__dirname, 'data', fileName);
  const workbook = xlsx.readFile(filePath);

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const jsonData = xlsx.utils.sheet_to_json(worksheet, {
    raw: false, 
    dateNF: 'dd-mmm-yyyy', 
  });
  console.log('jsonData',jsonData);
  // Custom function to parse and format dates
  const formattedData = jsonData.map(row => {
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        const value = row[key];
        if (typeof value === 'string' && value.match(/^\d{1,2}-[a-zA-Z]{3}-\d{4}$/)) {
          row[key] = new Date(value).toISOString().split('T')[0]; // Convert to ISO format
        }
      }
    }
    return row;
  });

  return formattedData;
}

module.exports = readXlsxFile;