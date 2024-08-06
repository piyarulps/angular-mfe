const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();
const builder = new xml2js.Builder();

const reportPaths = [
  'projects/project1/test-results/junit.xml',
  'projects/project2/test-results/junit.xml',
  'projects/project3/test-results/junit.xml',
];

const combinedResults = {
  testsuites: {
    testsuite: []
  }
};

let parsedCount = 0;

reportPaths.forEach((reportPath) => {
  const reportContent = fs.readFileSync(reportPath, 'utf8');
  parser.parseString(reportContent, (err, result) => {
    if (err) {
      console.error(`Error parsing ${reportPath}:`, err);
      return;
    }
    combinedResults.testsuites.testsuite.push(...result.testsuites.testsuite);
    parsedCount++;
    if (parsedCount === reportPaths.length) {
      const combinedXml = builder.buildObject(combinedResults);
      fs.writeFileSync('combined-test-results.xml', combinedXml);
      console.log('Combined test report written to combined-test-results.xml');
    }
  });
});
