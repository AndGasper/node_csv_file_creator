var fs = require('fs'); 
var util = require('util');

module.exports = {
    csv_file: fs.createWriteStream(`${__dirname}/csv_output/output.csv`, {flags: 'a'}),

    writeCsvFile: function (fileInfo) {
        this.csv_file.write(util.format.apply(null, arguments,fileInfo));
    }

}