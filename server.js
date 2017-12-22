const serverLogUtility = require('./server_log_utility');
const http = require('http');
const PORT = '3005';


const server = http.createServer((request, response) => {
    const {headers, method, url} = request; // Pull off the headers, method, and url of the request
    const userAgent = headers['user-agent'];
    
    serverLogUtility.logRequest(request); // I'm not sure how scalable this is, but it seems like there should be a more clever way to make sure that serverLog.logRequest is always given request
    serverLogUtility.consoleLog(request);

    switch(method) {
        case('POST'):
            let body = [];
            // request implements the ReadableStream interface -> the stream can be listened/piped elsewhere/whatever else you can do with streams 
            // So, let's listen for the 'data' and 'end' event 
            // Each 'data' event is a Buffer
            // Let's assume the data is going to be a string (just to follow along with this example)
            request.on('data', (chunk) => {
                // Data signifies the start of something
                serverLogUtility.consoleLog(`chunk: ${chunk}`);
                // console.log(`chunk: ${chunk}`);
                body.push(chunk);
            }).on('end', () => {

                // I'm sending myself saw application/json through Postman with with the raw option set. the form version was weird
                let bodyJson = JSON.parse(body.toString().trim());
                serverLogUtility.consoleLog(`bodyJson: ${bodyJson}`);

                body = Buffer.concat(body).toString();
                
                serverLogUtility.consoleLog(`body: ${body}`);

                response.statusCode = 200; 
                response.setHeader('Content-Type', 'application/json');

                const responseBody = {headers, method, url, body};

                response.write(JSON.stringify(responseBody));
                response.end();




            });
            break;

        default:
            serverLogUtility.consoleLog(`Not a post request`);
            // serverLogUtility.consoleLog(request); 
            // console.log('Not a post request');

    }

});

server.listen(PORT, () => {
    console.log(`Listening on: ${PORT}`);
});