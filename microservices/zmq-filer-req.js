'use strict';

const zmq = require('zeromq');
const host = process.argv[2];
const port = process.argv[3];
const filename = process.argv[4];

if (!host || !port || !filename) {
	throw Error('Error: Must specify 3 arguments. Host, Port, Filename.');
}

const requester = zmq.socket('req');

requester.on('message', data => {
	const response = JSON.parse(data);
	console.log('Received response: ', response);
});

requester.connect(`tcp://${host}:${port}`);
for (let i = 1; i < 10; i++) {
	console.log(`Sending request ${i} for file: ${filename}`);
	requester.send(JSON.stringify({
		path: filename
	}));
}
