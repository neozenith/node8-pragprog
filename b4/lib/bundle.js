/**
 * Provides API endpoints for working with book bundles
 */
'use strict';
const rp = require('request-promise');

module.exports = (app, es) => {
	const url = `http://${es.host}:${es.port}/${es.bundle_index}/bundle`;

	/**
	 * POST /api/bundle
	 * Create a new bundle.
	 * JSON body expects:
	 *
	 * {
	 *	name: <your bundle name>
	 *	books: [
	 *		<Your list of of book IDs>
	 *	]
	 * }
	 */
	app.post('/api/bundle', (req, res) => {
		const bundle = {
			name: req.query.name,
			books: []
		};

		rp.post({ url, body: bundle, json: true })
			.then(esResBody => res.status(201).json(esResBody))
			.catch(({ error }) => res.status(error.status || 502).json(error));
	});

	/**
	 * GET /api/bundle/:id
	 * Return details of bundles
	 *
	 * Throws 502 or ElasticSearch HTTP Error codes
	 */
	app.get('/api/bundle/:id', async (req, res) => {

		const options = {
			url: `${url}/${req.params.id}`,
			json: true
		};

		try {
			const esResBody = await rp(options);
			res.status(200).json(esResBody);
		} catch (esResErr) {
			res.status(esResErr.statusCode || 502).json(esResErr.error);
		}

	});

	/**
	 * PUT /api/bundle/:id/name/:name
	 * Set name property of bundle
	 *
	 * curl -X PUT http://<host>:<port>/api/bundle/<id>/name/<name>
	 */
	app.put('/api/bundle/:id/name/:name', async (req, res) => {
		const bundleUrl = `${url}/${req.params.id}`;

		try {
			//Get the current bundle by id and update the name in memory
			const bundle = (await rp({ url: bundleUrl, json: true }))._source;
			bundle.name = req.params.name;

			//PUT it back
			const esResBody = await rp.put({ url: bundleUrl, body: bundle, json: true });
			res.status(200).json(esResBody);

		} catch (esResErr) {
			res.status(esResErr.statusCode || 502).json(esResErr.error);
		}

	});

	/**
	 * PUT /api/bundle/:id/book/:pgid
	 * Add a book to the list by pgid
	 */

	app.put('/api/bundle/:id/book/:pgid', async (req, res) => {
		const bundleUrl = `${url}/${req.params.id}`;

		const bookUrl = `http://${es.host}:${es.port}/${es.books_index}/book/${req.params.pgid}`;

		try {
			//Fetch in parallel the bundle and the intended book to add
			const [bundleRes, bookRes] = await Promise.all([
				rp({url: bundleUrl, json: true}),
				rp({url: bookUrl, json: true})
			]);

			// Decompose important info
			const {_source: bundle, _version: version} = bundleRes;
			const {_source: book} = bookRes;

			// If the book isn't already in the bundle then push it onto the array
			const idx = bundle.books.findIndex(book => book.id === req.params.pgid);
			if (idx === -1) {
				bundle.books.push({
					id: req.params.pgid,
					title: book.title
				});
			}

			// Put the updated bundle back into the index
			const esResBody = await rp.put({
				url: bundleUrl,
				qs: { version  },
				body: bundle,
				json: true
			});
			res.status(200).json(esResBody);

		} catch (esResErr) {
			res.status(esResErr.statusCode || 502).json(esResErr.error);
		}
	});

};
