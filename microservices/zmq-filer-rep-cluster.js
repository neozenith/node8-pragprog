'use strict';
const host = process.argv[2];
const port = process.argv[3];

if (!host || !port) {
	throw Error('Error: Must specify two arguments. Host and Port.');
}

const cluster = require('cluster');
const fs = require('fs');
const zmq = require('zeromq');

const numWorkers = require('os').cpus().length;

if (cluster.isMaster) {

	console.log(`Binding on tcp://${host}:${port}`);
	const router = zmq.socket('router').bind(`tcp://${host}:${port}`);
	const dealer = zmq.socket('dealer').bind(`ipc://filer-dealer.ipc`);

	router.on('message', (...frames) => dealer.send(frames));
	dealer.on('message', (...frames) => router.send(frames));

	cluster.on('online', worker => console.log(`Worker ${worker.process.pid} is online...`));

	for (let i = 0; i < numWorkers; i++) {
		cluster.fork();
	}

} else {

	const responder = zmq.socket('rep').connect(`ipc://filer-dealer.ipc`);
	responder.on('message', data => {
		const request = JSON.parse(data);
		console.log(`${process.pid} received request for ${request.path}`);

		fs.readFile(request.path, (err, content) => {
			console.log(`${process.pid} Sending response content`);
			if (err) {
				responder.send(JSON.stringify(err));
			} else {
				responder.send(JSON.stringify({
					content: content.toString(),
					timestamp: Date.now(),
					pid: process.pid
				}));
			}
		});
	});

}

