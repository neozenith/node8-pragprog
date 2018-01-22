'use script';
const fs = require('fs');
const zmq = require('zeromq');
const filename = process.argv[2];
const port = 60400;

const publisher = zmq.socket('pub');
fs.watch(filename, () => {
	publisher.send(JSON.stringify({
		type: 'changed',
		file: filename,
		timestamp: Date.now()
	}));
});

publisher.bind(`tcp://*:${port}`, err => {
	if (err) {
		throw err;
	}

	console.log(`Listening for subscribers on ${port}`);
});

