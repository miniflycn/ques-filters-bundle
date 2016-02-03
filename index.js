var rollup = require('rollup'),
	memory = require('rollup-plugin-memory'),
	glob = require('glob');

/**
 * a-b-c => aBC
 * @private
 */
function formatName(name) {
	name = name.split('-');
	if (name.length === 1) return name;
	var res = name[0];
	for (var i = 0, l = name.length; i < l; i++) {
		res += name[1].replace(/^\w/, function (v) {
			return v.toUpperCase();
		});
	}
	return res;
}

/**
 * options {Object}
 * options.path {String} components path, default is './components/'
 */
module.exports = function (options, cb) {
	options.path = options.path || './components/';
	var path = options.path,
		pathLength,
		input = '',
		mains;
	// fixed path
	if (path[path.length - 1] !== '/') path += '/';

	pathLength = path.length;
	mains = glob.sync(path + '**/main.js');

	for (var i = 0, l = mains.length; i < l; i++) {
		input += 'import { filters as tmp' + i + ' } from "' + mains[i].slice(0, -3) + '";\n';
		input += 'export var ' + formatName(mains[i].slice(pathLength, -8)) + ' = tmp' + i + ';\n';
	}

	rollup.rollup({
		entry: 'main.js',
		plugins: [
			memory({
				contents: input
			})
		]
	}).then(function (bundle) {
		var result = bundle.generate({
			format: 'cjs'
		});

		cb(result.code);
	}).catch(function (e) {
		console.error(e);
	});

};