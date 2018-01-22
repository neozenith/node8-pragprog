'use strict';

const EventEmitter = require('events').EventEmitter;

class LDJClient extends EventEmitter {

	constructor(stream){
		super();
		let buffer = '';

		stream.on('data', data => {
			// Accumulate data
			buffer += data;

			// When a boundary is found
			let boundary = buffer.indexOf('\n');
			while (boundary !== -1) {
				// Chunk a valid bounded message
				// substring the remainder
				// emit the valid chunk
				// look for the next boundary to see if more work can be chunked
				const input = buffer.substring(0, boundary);
				buffer = buffer.substring(boundary + 1);
				this.emit('message', JSON.parse(input));
				boundary = buffer.indexOf('\n');
			}

		});
	}

	static connect(stream) {
		return new LDJClient(stream);
	}
}

module.exports = LDJClient;
