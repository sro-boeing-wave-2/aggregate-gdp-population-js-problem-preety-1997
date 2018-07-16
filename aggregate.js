/**

 * Aggregates GDP and Population Data by Continents

 * @param {*} filePath

 */

const fs = require('fs');


const aggregate = (filePath) => {
  const csvdata = fs.readFileSync(filePath, 'utf8');
  const stringdata = csvdata.toString();
  const arrayOne = stringdata.split('\r\n');
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
  const cc = fs.readFileSync('continent.txt', 'utf8');
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
  fs.writeFileSync(outputFile, JSON.stringify(continentData));
};

aggregate('./data/datafile.csv');
module.exports = aggregate;
