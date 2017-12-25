const serverLogUtility = require('./server_log_utility');
const csvFileUtility = require('./csv_file_utility');

const https = require("https");
const url = "https://api.coindesk.com/v1/bpi/currentprice.json";

https.get(url, (response) => {
  response.setEncoding("utf8");
  let body = [];
  response.on("data", (chunk) => {
    serverLogUtility.consoleLog(`chunk: ${chunk}\n`); 
    body.push(chunk);
  });
  response.on("end", () => {
    // body = Buffer.concat(body).toString();
    serverLogUtility.consoleLog(`body: ${body}`);
    csvFileUtility.writeCsvFile({'quote': body, 'source':url}); 
  });
});