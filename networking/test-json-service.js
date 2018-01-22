'use strict';
const port = 60300;

// Server Setup
const server = require('net').createServer(connection => {
	console.log('Subscriber connected');

	// Valid split message
	const firstChunk = '{"type":"changed","timesta';
	const secondChunk = 'mp":1450694370094}\n';

	//write each half with delay in middle
	connection.write(firstChunk);

	const timer = setTimeout(() => {
		connection.write(secondChunk);
		connection.end();
	}, 100);

	// CLeanup connection and timer
	connection.on('end', () => {
		clearTimeout(timer);
		console.log('Subscriber disconnected');
	});

});

server.listen(port, () => {
	console.log(`Test server listening for subscribers on ${port}`);
});
