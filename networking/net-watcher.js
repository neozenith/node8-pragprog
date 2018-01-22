#! /usr/bin/env node
'use strict';
const fs = require('fs');
const net = require('net');

const filename = process.argv[2];
const port = 60300;

if (!filename) {
	throw Error('Error: No filename specified');
}

net.createServer(connection => {
	console.log('Subscriber connected');

	connection.write(

			JSON.stringify({
				type: 'watching',
				file: filename
			}) + '\n'
	);

	const watcher = fs.watch(filename, () => connection.write(
			JSON.stringify({
				type: 'changed',
				timestamp: Date.now()
			}) + '\n'
		)
	);

	connection.on('close', () => {
		console.log('Subscriber disconnected.');
		watcher.close();
	});

})
	.listen(port, () => console.log(`Listening for subscribers on ${port}`));
