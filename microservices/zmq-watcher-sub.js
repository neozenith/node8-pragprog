'use strict';

const host = process.argv[2];
const port = process.argv[3];

if (!host || !port) {
	throw Error('Error: Must specify two arguments. Host and Port.');
}

const zmq = require('zeromq');
const subscriber = zmq.socket('sub');
subscriber.subscribe('');

subscriber.on('message', data => {
	const message = JSON.parse(data);
	const date = new Date(message.timestamp);
	console.log(`File "${message.file}" changed at ${date}`);
});

subscriber.connect(`tcp://${host}:${port}`);
