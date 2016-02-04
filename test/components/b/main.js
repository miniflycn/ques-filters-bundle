var b = require('./b');

module.exports = {
	data: {
		test: 'test'
	},
	filters: {
		hello: function (v) {
			return v;
		},
		world: b
	}
}