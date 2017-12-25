var fs = require('fs'); // File system for writing to log file 
var util = require('util'); // For formatting the log messages
// var logStdout = process.stdout;

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

    commonLogFormatTimestamp: function(date) {
        // Common Log Format: host ident authuser date request status bytes
        // YYYY-MM-DD:HH:mm:ss +/- nnnn
        // nnnn = time zone offet
        let YYYY = date.getFullYear();
        // JavaScript's date library has the months of the year running from 0-11, e.g. January = 0
        // That feel when the memes are too real
        let MM = date.getMonth()+1; 
        let DD = date.getDate(); 
        let HH = date.getHours(); 
        let mm = date.getMinutes();
        let ss = date.getSeconds();
        


        // console.log(`date.toTimeString(): ${date.toTimeString()}`);

        // dateObj.getTimeZoneOffset method returns a number representing the time-zone offset from UTC, in minutes, for the fdate based on current host system settings
        let timeZoneOffset = {
            // 'inHours': date.getTimeZoneOffset()/60
            'inHours': parseInt(date.toTimeString().slice(13,17))/100
        }; 
        timeZoneOffset.isInteger = timeZoneOffset.inHours % 1 === 0; 
        timeZoneOffset.isPositive = timeZoneOffset.inHours >= 0; // > || = to allow for the possibility that its UTC 0000

        // Convert the numeric type to a string, and prefix any time values less than 10 with a leading 0 to maintain two sig. fig. format
        MM = (MM < 10) ? `0${MM}` : `${MM}`; 
        DD = (DD < 10) ? `0${DD}` : `${DD}`; 
        HH = (HH < 10) ? `0${HH}` : `${HH}`; 
        mm = (mm < 10) ? `0${mm}` : `${mm}`; 
        ss = (ss < 10) ? `0${ss}` : `${ss}`;

        // There's a switch/case statement for this situation, but I'm tired.

        // Is the number value an integer and is it positive?
        if (timeZoneOffset.isInteger) {
            // If the timeZoneOffset.inHours is less than 10 but greater than 0 
            if (timeZoneOffset.isPositive) {
                timeZoneOffset.inHoursString = (timeZoneOffset.inHours < 10) ?  `+0${timeZoneOffset.inHours}00` : `+${timeZoneOffset.inHours}00`;  
            } else {
               // the number is negative but still an integer; Better phrasing? - The number is an integer and negative   
               // A two digit negative hour value greater than 10 will already have the -, so there is no need to add it.
               timeZoneOffset.inHoursString = (timeZoneOffset.inHours < 10) ?  `-0${timeZoneOffset.inHours}00` : `${timeZoneOffset.inHours}00`; 
            }
        } else {
            // the hours value is not an integer 
            if (timeZoneOffset.isPositive) {
                // Can still be positive though, e.g. 3.5
                // the isPositive seems a little silly now considering x < 0 && x < 10 would work 
               if  (timeZoneOffset.inHours < 10) {
                   let timeZoneString = String(timeZoneOffset.inHour);
                   timeSetOffset.inHoursString = (timeZoneString[2] === '5') ? `+0${timeZoneString[0]}30` : `+0${timeZoneString[0]}45`;    
               } else {
                   // Still in positive float land, but for 2-digit values, 10-14, Still need to address the x:30 and x:45 cases 
                let timeZoneString = String(timeZoneOffset.inHourz);
                timeSetOffset.inHoursString = (timeZoneString[2] === '5') ? `+${timeZoneString[0]}30` : `+${timeZoneString[0]}45`;    
               }
            }
        }

        const commonLogFormatTimestampString  = `[${YYYY}-${MM}-${DD}:${HH}:${mm}:${ss}]`;
        return commonLogFormatTimestampString;
    },

    logRequest: function() {
        
        
        const {headers}  = arguments[0];
        // console.log(arguments);
        const accessLogFields = {
            'host': `${headers['host']}`,
            'ident': `${headers['user-agent']}`,
            'authuser': '-',
            'date': this.commonLogFormatTimestamp(new Date()),
            'request': '-',
            'status': '-',
            'bytes': '-'
        };
        // console.log(accessLogFields);
        /**
         * { host: 'localhost:3005',
            ident: 'PostmanRuntime/7.1.1',
            authuser: '',
            date: '[2017-12-22:17:56:36]',
            request: '',
            status: '',
            bytes: '' 
        }

         */



        
        // console.log(this.access_log_file);
        // console.log(accessLogFields);
        // const message = `${accessLogFields.date} `;
        // Interestingly enough, passing a string templated value to util.format.apply throws an error
        // TypeError: CreateListFromArrayLike called on non-object
        // this.debug_console_log_file.write(`${util.format.apply(null, arguments)}\n`);
        // Yeah, I don't think I am hitting the high water mark for the accessLogFields. 
        // console.log('arguments', arguments);

        // Common Log Format: host ident authuser date request status bytes
        const message = `${accessLogFields.date} ${accessLogFields.host} ${accessLogFields.ident}`; 
        this.access_log_file.write(`${message}\n`);
        // console.log(this.access_log_file); 
    }

}

