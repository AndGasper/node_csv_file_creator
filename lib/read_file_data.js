const fs = require('fs');
// [username]\n
	// aws_access_key_id = {accessKey}\n
	// aws_secret_access_key = {awsSecretAccessKey}\n
	const CsvFileData ={
		// Shame on me for setting two things in a setter
		headers: {
			set setHeaderKeyAndIndex(header) {
			return this[header.headerKey] = header.headerIndex;
			}
		},
		values: {
			set setFormattedValuesAndIndex(value) {
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
				headerKeyValuePairs[header] = this.getHeaderValue(header);
			});
			return headerKeyValuePairs;
		}
}

module.exports = {
	/**
	 * @name readFileData 
	 * @param {string} filePath  - Path to file that will be used in readStream
	 * @param {int} fileDescriptor - Available from 
	 * @description - Creates a read stream using the file provided and parses the files contents in a VERY specific manner (CSV style)
	 */
	readFileData: function(filePath, fileDescriptor) {
		// Wrap the entire function in a promise so the data available when the 'end' method is fired can be resolved 
		return new Promise((resolve, reject) => {
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
			// But, potentially, many sets of values
			// Mostly because I can't figure out getters/setters at the moment using function CsvFileData() notation
			const data = Object.assign(CsvFileData); 
			function onDataChunk(chunk) {
				// WARNING: Pretty sure it's just happenstance that 1 chunk = both lines of the file 
				let rawChunk = chunk;
				//  ASSUME: trimming a trailing carriage return is okay\
				// THIS SHOULD BE PASSED AS A CONFIGURATION TO ANOTHER FUNCTION

				// STEPS?
				// PRE-PROCESS FILE: GET LINE ENDINGS, TRIM LINE ENDINGS
				// PROCESS: PULL DATA 
				// POST-PROCESS: FORMAT DATA
				let carriageReturnTrimmedChunk = rawChunk.trim('\r\n'); 
				let line = carriageReturnTrimmedChunk.split('\r\n');
				// console.log('line', line);
				line.map((item, index) => {
					// item = Un-separated list
					// console.log(item);
					let value = item.split(','); 
					// Breaking the chunk at the \r\n, for it's current usage, pretty much makes the index = the line number
					// if the index is 0 -> then it's the file headers
					if (index === 0) {
						// Set the file header values
						value.map((headerValue, index) => {
							data.headers.setHeaderKeyAndIndex = { headerKey: headerValue, headerIndex: index }; 
						});
					} else {
						// set the file values 
						value.map((itemValue, index) => {
							return data.values.setFormattedValuesAndIndex = { index: index, dataValue: itemValue }; 
						});
					}
				});
			}
			function onReadStreamEnd() {
				return data;
			}
			// Attach file stream event handlers
			fileStream.on('data', onDataChunk);
			// Resolve the data
			fileStream.on('end', function() {
				resolve(onReadStreamEnd());
			});

		});
	}
};

