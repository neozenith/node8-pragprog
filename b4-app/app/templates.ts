import * as HandleBars from '../node_modules/handlebars/dist/handlebars.js';

export const main = HandleBars.compile(`
	<div class="container">
		<h1>B4 - Book Bundler</h1>
		<div class="b4-alerts"></div>
		<div class="b4-main"></div>
	</div>
`);

export const welcome = HandleBars.compile(`
	<div class="jumbotron">
		<h1>Welcome!</h1>
		<p>B4 is an aplication for creating book bundles</p>
	</div>
`);

export const alert = HandleBars.compile(`
	<div class="alert alert-{{type}} alert-dismissable fade in" role="alert">
		<button class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		{{message}}
		<strong>Success!</strong> Bootstrap is working.
	</div>
`);

export const listBundles = HandleBars.compile(`
	<div class="panel panel-default">
		<div class="panel-heading">Your Bundles</div>
		{{#if bundles.length}}
			<table class="table">
				<tr>
					<th>Bundle Name</th>
					<th>Actions</th>
				</tr>
			{{#each bundles}}
				<tr>
					<td>
						<a href="#view-bundle/{{id}}">{{name}}</a>
					</td>
					<td>
						<button class="btn delete" data-bundle-id="{{id}}">Delete</button>
					</td>
				</tr>
			{{/each}}
			</table>
		{{else}}
			<div class="panel-body"><p>None yet!</p></div>
		{{/if}}
	</div>
`);
