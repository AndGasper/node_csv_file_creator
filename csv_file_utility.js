var fs = require('fs'); 
var util = require('util');

module.exports = {
    csv_file: fs.createWriteStream(`${__dirname}/csv_output/output.csv`, {flags: 'a'}),

    writeCsvFile: function (fileInfo) {
        // date/time the request was made
        // price -> price in usd 
        // source of the quote
        // const headers = {
        //     'date': '',
        //     'price': '',
        //     'source': ''
        // };
        const headers = 'Date, Price, Source \n\t';
        let data = this.formatDataToCSV(fileInfo);
        data = headers + data; 
        this.csv_file.write(`${data}`);
    },

    formatDataToCSV: function(data) {
        
        let quote = JSON.parse(data.quote);
        // I'm too lazy right now to deal with having the , inside the data, so for now, I'll cheat and use the easiest ones
        let formattedData = `${quote.time.updatedISO}, ${quote.bpi.USD.rate_float}, ${data.source} \n\t`;
        
        return formattedData; 

    }

}