const fs = require('fs');

const readDataFile = function datafile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const write = function writeFile(output, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(output, data, (err) => {
      if (err === null) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
};

const continentfile = 'continent.json';
const output = './output/output.json';
const aggregate = filePath => new Promise((resolve, reject) => {
  Promise.all([readDataFile(filePath), readDataFile(continentfile)]).then((values) => {
    const fileData = values[0]; // csv file data
    const mapper = JSON.parse(values[1]);// continent country data
    const data = fileData.replace(/['"]+/g, '').split('\n');
    const headerText = data[0].split(',');
    const indexOfCountry = headerText.indexOf('Country Name');
    const indexOfgdp = headerText.indexOf('GDP Billions (US Dollar) - 2012');
    const indexOfPopulation = headerText.indexOf('Population (Millions) - 2012');
    const aggregateresult = {};

    data.forEach((element) => {
      const row = element.split(',');
      if (mapper[row[indexOfCountry]] !== undefined) {
        if (aggregateresult[mapper[row[indexOfCountry]]] === undefined) {
          aggregateresult[mapper[row[indexOfCountry]]] = {};
          aggregateresult[mapper[row[indexOfCountry]]]
            .GDP_2012 = parseFloat(row[indexOfgdp]);
          aggregateresult[mapper[row[indexOfCountry]]]
            .POPULATION_2012 = parseFloat(row[indexOfPopulation]);
        } else {
          aggregateresult[mapper[row[indexOfCountry]]].GDP_2012
            += parseFloat(row[indexOfgdp]);
          aggregateresult[mapper[row[indexOfCountry]]].POPULATION_2012
            += parseFloat(row[indexOfPopulation]);
        }
      }
    });
    write(output, JSON.stringify(aggregateresult)).then(() => {
      resolve();
    }).catch((error) => {
      reject(error);
    });
  }).catch((error) => {
    reject(error);
  });
});
module.exports = aggregate;
