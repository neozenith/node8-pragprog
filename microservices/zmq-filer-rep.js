'use strict';
const host = process.argv[2];
const port = process.argv[3];

if (!host || !port) {
	throw Error('Error: Must specify two arguments. Host and Port.');
}

const fs = require('fs');
const zmq = require('zeromq');

const responder = zmq.socket('rep');

responder.on('message', data => {
	const request = JSON.parse(data);
	console.log(`Received request to get: ${request.path}`);

	fs.readFile(request.path, (err, content) => {
		console.log('Sending response content');

		responder.send(JSON.stringify({
			content: content.toString(),
			timestamp: Date.now(),
			pid: process.pid
		}));

	});

});

responder.bind(`tcp://${host}:${port}`, err => {
	console.log(`Listening for requesters at ${host}:${port}`);
	process.on('SIGINT', () => {
		console.log('Shutting down...');
		responder.close();
	});

});
