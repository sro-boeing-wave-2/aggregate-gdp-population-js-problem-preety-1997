const fs = require('fs');

const readDataFile = function datafile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const readCountryFile = function f2(continent) {
  return new Promise((resolve, reject) => {
    fs.readFile(continent, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });

  });
}
function writeFile(output, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(output, data, (error) => {
      if (error === null) {
        resolve(data);
      } else {
        reject(error);
      }
    });
  });
}

const continent = 'continent.txt';
const output = './output/output.json';
const aggregate = filePath => new Promise((resolve, reject) => {
  Promise.all([readDataFile(filePath), readCountryFile(continent)]).then((values) => {
    const csvdata = values[0]; // csv file data
    const cc = values[1];// continent country data
    const stringdata = csvdata.toString();
    const arrayOne = stringdata.split('\n');
    const header = arrayOne[0].split(',');
    const noOfRow = arrayOne.length;
    const noOfCol = header.length;
    const countryfiledataobject = [];
    const conticountry = [];
    const outputFile = './output/output.json';


    for (let i = 1; i < noOfRow - 1; i += 1) {
      const obj = {};
      const myNewLine = arrayOne[i].split(',');

      for (let j = 0; j < noOfCol; j += 1) {
        const headerText = header[j].substring(1, header[j].length - 1);
        const valueText = myNewLine[j].substring(1, myNewLine[j].length - 1);
        obj[headerText] = valueText;
      }
      countryfiledataobject.push(obj);
    }
    const ccrow = cc.split('\n');
    const countryContinentMap = new Map();
    let ccsplit;
    for (let i = 0; i < ccrow.length; i += 1) {
      ccsplit = ccrow[i].split(',');
      ccsplit[1] = ccsplit[1].replace(/\r/g, '');
      countryContinentMap.set(ccsplit[0], ccsplit[1]);
    }
    /*  countryContinentMap - (country - continent map from external data ,
      countryfiledataobject - (object created from data file )) */
    for (let i = 0; i < countryfiledataobject.length; i += 1) {
      if (countryfiledataobject[i]['Country Name'] !== 'European Union') {
        countryfiledataobject[i].continent = countryContinentMap.get(countryfiledataobject[i]['Country Name']);
        conticountry.push(countryContinentMap.get(countryfiledataobject[i]['Country Name']));
      }
    }

    const continent = new Set(conticountry);
    const continentData = {};

    continent.forEach((cont) => {
      continentData[cont] = {

        GDP_2012: 0,
        POPULATION_2012: 0,

      };
    });
    for (let i = 0; i < conticountry.length; i += 1) {
      continentData[conticountry[i]].GDP_2012 += parseFloat(countryfiledataobject[i]['GDP Billions (US Dollar) - 2012']);

      continentData[conticountry[i]].POPULATION_2012 += parseFloat(countryfiledataobject[i]['Population (Millions) - 2012']);
    }
    writeFile(output, JSON.stringify(continentData)).then(() => {
      resolve();
    }).catch((error) => {
      reject(error);
    });
  }).catch((error) => {
    reject(error);
  });
});
module.exports = aggregate;