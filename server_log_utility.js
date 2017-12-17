var fs = require('fs'); // File system for writing to log file 
var util = require('util'); // For formatting the log messages

// Common Log Format: host ident authuser date request status bytes
/**
 *  host - who made the request 
 * 
 */


module.exports = {
    debug_console_log_file:  fs.createWriteStream(`${__dirname}/logs/debug.log`, {flags: 'a'}),
    access_log_file: fs.createWriteStream(`${__dirname}/logs/access.log`, {flags: 'a'}),

    consoleLog: function() {
    // Write to the log file
    // Use apply(null, arguments) to 
    this.debug_console_log_file.write(`${util.format.apply(null, arguments)}\n`);
    // this.logStdOut.write(`${util.format.apply(null, arguments)}\n`);
    },
    logRequest: function() {
        /**
         *  Is my use of getMethodName potentially misleading? 
         *  I hadn't really thought through whether or not these were really getters or setters
         *  So, for now, don't read any deeper into the names 
         */
        
         // There may be an argument to making this a getter and a setter, so it'd be like:
         // Date.prototype.commonLogFormatTimestamp = [YYYY:MM:DD:HH:mm:ss +/- {timezone 4 digit code}]
         // Date.prototype.setCommonLogFormatTimestamp = // do all the string building stuff 
         // then when I go to assign it in accessLogFields.date I go new Date().getCommonLogFormatTimestamp()
         // And just add something to either make it so that on new Date() setCommonLogFormatTimestamp is always invoked, 
         // or I have the getter call the setter? 
         // ^ That just seems weird though because if the getter can always call the setter, what's the point?

        this.commonLogFormatTimestamp = function() {
            // YYYY-MM-DD:HH:mm:ss +/- nnnn
            let YYYY = this.getFullYear();
            // JavaScript's date library has the months of the year running from 0-11, e.g. January = 0
            // That feel when the memes are too real
            this.MM = this.getMonth()+1; 
            this.DD = this.getDate(); 
            this.HH = this.getHours(); 
            this.mm = this.getMinutes();

            
            
            MM = (MM < 10) ? `0${MM}` : `${MM}`; // If the month is less than 10, then prefix '0' for consistent MM date format

            
            DD = (DD < 10) ? `0${DD}` : `${DD}`; // If the day is less than 10s, then prefix '0' for consistent DD date format

            
            HH = (HH < 10) ? `0${HH}` : `${HH}`; // If the hour is less 

            // Which is more expensive: a variable assignment or two invocations of getMinutes? 
            // Or, is there a non-trivial probability that this.getMinutes() will return two different values in this time frame? 
            // let mm = (this.getMinutes() < 10) ? `0${this.getMinutes()}` : `${this.getMinutes()}`;
            
            


            return `${YYYY}-${MM}-${DD}`;
        }

        const {url, method, }
        const accessLogFields = {
            'host': arguments[0],
            'ident': '',
            'authuser': '',
            'date': this.commonLogFormatTimestamp(new Date()),
            'request': '',
            'status': '',
            'bytes': ''
        };
        
        
        // Common Log Format: host ident authuser date request status bytes
        const commonLogFormatAccessLogFields = function() {
            let message = `${date} - $`
            return message; 
        } 



        const message = `${accessLogFields}`
        
        
        this.access_log_file.write(util.format.apply(null, mesage));
    }

}

