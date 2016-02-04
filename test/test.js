var bundle = require('../'),
	vm = require('vm'),
	_module = { exports: {}},
	context = new vm.createContext({ module: _module, exports: _module.exports });

describe('test', function () {
	it('should build a bundle', function (done) {
		bundle({ path: './test/components/' }, function (res) {
			var script = new vm.Script(res);
			script.runInContext(context);
			_module.exports.a.hello('world').should.equal('world');
			_module.exports.a.world(123).should.equal(124);
			_module.exports.b.hello('world').should.equal('world');
			_module.exports.b.world(123).should.equal(124);
			done();
		});
	});
});