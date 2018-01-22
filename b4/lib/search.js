'use strict';

const request = require('request');
module.exports = (app, es) => {

	const url = `http://${es.host}:${es.port}/${es.books_index}/book/_search`;

	app.get('/api/search/books/:field/:query', (req, res) => {
		const esReqBody = {
			size: 10,
			query: {
				match: {
					[req.params.field]: req.params.query
				}
			}
		};

		const options = { url, json: true, body: esReqBody };

		request.get(options, (err, esRes, esResBody) => {

			if (err) {

				res.status(502).json({
					error: 'bad_gateway',
					reason: err.code
				});

				return;
			}

			if (esRes.statusCode !== 200) {
				res.status(esRes.statusCode).json(esResBody);
				return;
			}

			res.status(200).json(esResBody.hits.hits.map(({ _source }) => _source));

		});

	});

	app.get('/api/suggest/:field/:query', (req, res) => {

		//Define elastic search request body
		const esReqBody = {
			size: 0,
			suggest: {
				suggestions: {
					text: req.params.query,
					term: {
						field: req.params.field,
						suggest_mode: 'always',
					}
				}
			}
		};

		//Define http request options
		const options = { url, json: true, body: esReqBody };

		//Define promise
		const promise = new Promise((resolve, reject) => {
			request.get(options, (err, esRes, esResBody) => {

				//Check for errors, eg 5xx
				if (err) {
					reject({ error: err });
					return;
				}

				//Check for HTTP errors, eg 4xx
				if (esRes.statusCode !== 200) {
					reject({ error: esResBody });
					return;
				}

				//Success situation
				resolve(esResBody);

			});

		});

		// Define resolve / reject callbacks to associate with promise
		promise
			.then(esResBody => {
				res
					.status(200)
					.json(esResBody.suggest.suggestions);
			})
			.catch(({ error }) => {
				res
					.status(error.status || 502)
					.json(error);
			});

	});
};
