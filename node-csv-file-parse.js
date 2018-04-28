const fs = require('fs');
const inputFilePath = process.argv[2]; // ASSUME the input file is the first argument following node {pathToNodeScript} inputFile outputFile
const outputFilePath = process.argv[3]; // ASSUME the output file is the second argument 


fs.open(inputFilePath, 'r', (error, fileDescriptor) => {
	if (error) {
		if (error.code === 'ENOENT') {
			console.error('input file does not exist; or the path is messed up'); 
			return;
		}

		throw error;
	}

	// De way is to try first and catch the error
	readFileData(inputFilePath, fileDescriptor); 
});

function readFileData(filePath, fileDescriptor) {
	// So it doesn't just return the buffer
	const fileReadOptions = {
		encoding: 'utf8',
		flags: 'r'

	};
	console.log('filePath', filePath);
	const options = {
		flags: 'r',
		encoding: 'utf8',
		fd: fileDescriptor,
		mode: 0o666,
		autoClose: true
	};
	let encoding = 'utf8';
	const fileStream = fs.createReadStream(filePath, options); // God, I hope fileStream isn't a reserved word
	// fileStream.setEncoding(encoding);
	// the value of the header key is the index it was found in
	// ASSUMPTION: A file only has one set of headers
	// But potentially, many sets of values

	const data = Object.assign(CsvFileData);

	fileStream.on('data', (chunk) => {
		// WARNING: Pretty sure it's just happenstance that 1 chunk = both lines of the file 
		let rawChunk = chunk;
		let carriageReturnTrimmedChunk = rawChunk.trim('\r\n'); //  ASSUME: trimming a trailing carriage return is okay
		let line = carriageReturnTrimmedChunk.split('\r\n');
		// console.log('line', line);
		line.map((item, index) => {
			// item = Un-separated list
			// console.log(item);
			let value = item.split(','); 
			// Breaking the chunk at the \r\n, for it's current usage, pretty much makes the index = the line number
			if (index === 0) {
				value.map((headerValue, index) => {
					data.headers.setHeaderKeyAndIndex = { headerKey: headerValue, headerIndex: index }; 
				});	
			} else {
				value.map((itemValue, index) => {
					return data.values.setFormattedValuesAndIndex = { index: index, dataValue: itemValue }; 
				});
			}
			
		});
	});

	fileStream.on('end', function() {
		console.log('data', data);
		console.log('end'); 
		// console.log(data.getHeaderValue('User name'));
		console.log('Object.keys(data.headers)', Object.keys(data.headers));
		let a = data.getAssociatedHeadersAndValues(Object.keys(data.headers)); 
		console.log('a', a);
	});
}

function templateCredentials(credentialData) {
	const {'User name' : userName } = credentialData; 
	console.log('userName', userName);
}

// [username]\n
// aws_access_key_id = {accessKey}\n
// aws_secret_access_key = {awsSecretAccessKey}\n

const CsvFileData = {
		// Shame on me for setting two things in a setter
		headers: {
			set setHeaderKeyAndIndex(header) {
			return this[header.headerKey] = header.headerIndex;
			}
		},
		values: {
			setFormattedValuesAndIndex(value) {
				return this[value.index] = value.dataValue; // didn't want to use value.value
			}
		},
		getHeaderValue(header) {
			return this.values[this.headers[header]];
		},
		/**
		 * @name getAssociatedHeadersAndValues
		 * @param {array} headers - the names of the headers to get the values for 
		 * @return {object} headerKeyValuePairs - key = headerName, value = value of t
		 */
		getAssociatedHeadersAndValues(headers) {
			const headerKeyValuePairs = {}
			headers.map((header) => {
				headerKeyValuePairs.item = this.getHeaderValue(header);
			});
			return headerKeyValuePairs;
		}
	};