#! /usr/bin/env node
'use strict';
const port = process.argv[2];
if (!port) {
	throw Error('Error: No port specified');
}

const netClient = require('net').connect({ port: port });
const ldjClient = require('./lib/ldj-client.js').connect(netClient);
ldjClient.on('message', message => {
	console.log(message);

	if (message.type === 'watching') {
		console.log(`Now watching ${message.file}`);
	} else if (message.type === 'changed') {
		const date = new Date(message.timestamp);
		console.log(`File changed: ${date}`);
	} else {
		console.log(`Unrecognised message type: ${message.type}`);
	}
});

