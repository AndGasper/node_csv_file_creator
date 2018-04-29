const fs = require('fs');
const inputFilePath = process.argv[2]; // ASSUME the input file is the first argument following node {pathToNodeScript} inputFile outputFile
const outputFilePath = process.argv[3]; // ASSUME the output file is the second argument 
const readFileData = require('./read_file_data');


function templateCredentials(credentialData) {
	const { 'User name' : userName, 'Access key ID': accessKeyId, 'Secret access key': secretAccessKey } = credentialData; 
	// console.log('userName', userName);
	const templatedOutput = `[${userName}]\naws_secret_key_id = ${accessKeyId}\naws_secret_access_key = ${secretAccessKey}`;
	return templatedOutput;
}

fs.open(inputFilePath, 'r', (error, fileDescriptor) => {
	if (error) {
		if (error.code === 'ENOENT') {
			console.error('input file does not exist; or the path is messed up'); 
			return;
		}

		throw error;
	}

	// Read the data from the file asynchronously 
	(async function() {
		try {
			var result =  await readFileData.readFileData(inputFilePath, fileDescriptor);
			// console.log('result', result);
			let unformattedCredentials = result.getAssociatedHeadersAndValues(Object.keys(result.headers)); 
			let formattedCredentials = templateCredentials(unformattedCredentials);
			// console.log(formattedCredentials);
			// result.credentials = formattedCredentials;
			console.log('formattedCredentials', formattedCredentials);
		} catch(error) {
			console.log('error inside of async block', error); 
		}
	})();
	
});