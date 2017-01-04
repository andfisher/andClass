/**
 * @desc Jasmine Test Spec for andClass. Compatible with jasmine-2.5.2
 * @author Andrew Fisher
 * @copyright Copyright (c) 2017 Andrew Fisher (andfisher)
 */

describe('Class', function() {

	it('should create a class namespace', function() {
		Class('Test', {});
		expect(typeof new Test()).toBe('object');
	});
	
	it('should create methods from passed-in functions', function() {
		Class('Test', {
			'foo': function() {
				return 'bar';
			},
			'hello': function() {
				return 'world';
			}
		});
		var test = new Test();
		expect(typeof test.foo).toEqual('function');
		expect(typeof test.hello).toEqual('function');
		expect(test.foo()).toEqual('bar');
		expect(test.hello()).toEqual('world');
	});
	
	it('should have an init function that fires on creation', function(){
		var value = false;
		Class('Test', {
			init: function() {
				value = true;
			}
		});
		
		var test = new Test();
	
		expect(value).toBe(true);
	});
  
	it('should create member variables from non-functions passed to it', function() {

		Class('Test', {
			foo: 'bar',
			obj: {'foo': 'bar'},
			hello: ['w','o','r','l','d']
		});
		
		var test = new Test();
		expect(test.foo).toEqual('bar');
		expect(test.obj).toEqual({'foo': 'bar'});
		expect(test.hello).toEqual(['w','o','r','l','d']);
	});
  
	it('should create a new class, but not init itself', function() {
		var value = false;
		Class('Test', {
			init: function() {
				value = true;
			}
		});
		expect(value).toBe(false);
	});

	it('should allow for creating mulitple discrete objects', function() {

		Class('Test', {
			testVal: null
		});
		
		var test1 = new Test({
			testVal: 1
		});
		
		var test2 = new Test({
			testVal: 2
		});
		
		var test3 = new Test({
			testVal: 3
		});
		
		var test4 = new Test();
		
		expect(test1.testVal).toEqual(1);
		expect(test2.testVal).toEqual(2);
		expect(test3.testVal).toEqual(3);
		expect(test4.testVal).toEqual(null);
	});

	it('should allow for extending objects', function() {

		Class('Alpha', {
			methodName: function() {
				return 'testValue';
			}
		});
		
		Class('Beta', {
			Extends: [Alpha]
		});
		
		var beta = new Beta();
		
		expect(typeof beta.methodName).toEqual('function');
		expect(beta.methodName()).toEqual('testValue');
	});
	
	it('should not copy values between objects', function() {
		Class('Test', {
			variable: 0,
			arrs: []
		});
		
		var test1 = new Test({
			variable: 1,
			arrs: ['test']
		});
		
		var test2 = new Test({
			variable: 2,
			arrs: ['test', 'test']
		});
	
		expect(test1.variable).toEqual(1);
		expect(test2.variable).toEqual(2);
		expect(test1.arrs.length).toEqual(1);
		expect(test2.arrs.length).toEqual(2);
	});
  
	it('should allow extended classes to be futher extended', function(){

		Class('Alpha', {
			alpha: function() {
				return 1;
			}
		});
		
		Class('Beta', {
			Extends: Alpha,
			beta: function() {
				return 2;
			}
		});

		Class('Gamma', {
			Extends: [Beta],
			gamma: function() {
				return 3;
			}
		});
		
		Class('Delta', {
			Extends: [Gamma],
			delta: function() {
				return 4;
			}
		});

		var alpha = new Alpha();
		var beta = new Beta();
		var gamma = new Gamma();
		var delta = new Delta();
		
		expect(typeof alpha.alpha).toEqual('function');
		expect(typeof beta.alpha).toEqual('function');
		expect(typeof gamma.alpha).toEqual('function');
		expect(typeof delta.alpha).toEqual('function');

		expect(typeof alpha.beta).toEqual('undefined');
		expect(typeof beta.beta).toEqual('function');
		expect(typeof gamma.beta).toEqual('function');
		expect(typeof delta.beta).toEqual('function');
		
		expect(typeof alpha.gamma).toEqual('undefined');
		expect(typeof beta.gamma).toEqual('undefined');
		expect(typeof gamma.gamma).toEqual('function');
		expect(typeof delta.gamma).toEqual('function');
		
		expect(typeof alpha.delta).toEqual('undefined');
		expect(typeof beta.delta).toEqual('undefined');
		expect(typeof gamma.delta).toEqual('undefined');
		expect(typeof delta.delta).toEqual('function');
		
		expect(alpha.alpha()).toEqual(1);
		expect(beta.alpha()).toEqual(1);
		expect(gamma.alpha()).toEqual(1);
		expect(delta.alpha()).toEqual(1);

		expect(beta.beta()).toEqual(2);
		expect(gamma.beta()).toEqual(2);
		expect(delta.beta()).toEqual(2);
		
		expect(gamma.gamma()).toEqual(3);
		expect(delta.gamma()).toEqual(3);
		
		expect(delta.delta()).toEqual(4);
	  });
	  
	  it('should allow extending from multiple classes', function() {

		Class('Alpha', {
			alpha: function() {
				return 1;
			}
		});
		
		Class('Beta', {
			beta: function() {
				return 2;
			}
		});

		Class('Gamma', {
			gamma: function() {
				return 3;
			}
		});
		
		Class('Delta', {
			Extends: [Alpha, Beta, Gamma]
		});
	  
		var delta = new Delta();
	  
		expect(typeof delta.alpha).toEqual('function');
		expect(typeof delta.beta).toEqual('function');
		expect(typeof delta.gamma).toEqual('function');
	  
		expect(delta.alpha()).toEqual(1);
		expect(delta.beta()).toEqual(2);
		expect(delta.gamma()).toEqual(3);
	});

	it('should accept a `Uses` key that shares a prototype with all classes that also `Uses` it', function() {
	  
		Class('Alpha', {
			foo: ['bar'],
			testing: 123,
			hello: 'Cleveland'
		});
		
		Class('Beta', {
			Uses: {
				registry: Alpha
			}
		});
		
		var beta = new Beta();

		expect(typeof beta.registry).not.toEqual('undefined');
		expect(beta.registry.foo).toEqual(['bar']);
		expect(beta.registry.testing).toEqual(123);
		expect(beta.registry.hello).toEqual('Cleveland');
	});

	it('should be aware of changes to objects it Uses', function() {
	  
		Class('Alpha', {
			foo: ['bar'],
			testing: 123,
			hello: 'Cleveland'
		});
		
		Class('Beta', {
			Uses: {
				registry: Alpha
			}
		});
		
		var beta = new Beta();
		
		Alpha.prototype.foo.push('bat');
		Alpha.prototype.testing = null;
		Alpha.prototype.hello = 'World!';
		
		expect(beta.registry.foo).toEqual(['bar', 'bat']);
		expect(beta.registry.testing).toBe(null);
		expect(beta.registry.hello).toEqual('World!');
	});
	
	it('should set methods starting with a `_` as private (not extended)', function() {

		Class('Alpha', {
			'_method' : function() {
				return 1;
			}
		});
		
		Class('Beta', {
			Extends: Alpha
		});
		
		var alpha = new Alpha();
		var beta = new Beta();
	  
		expect(typeof alpha._method).toEqual('function');
		expect(alpha._method()).toEqual(1);
		expect(typeof beta._method).toEqual('undefined');
	  });
	  
	  it('should set variables starting with a `_` as private (not extended)', function() {
	  
		Class('Alpha', {
			'_variable' : 1
		});
		
		Class('Beta', {
			Extends: Alpha
		});
		
		var alpha = new Alpha({
			'_variable' : 2
		});
		var beta = new Beta();
	  
		expect(alpha._variable).toEqual(2);
		expect(typeof beta._variable).toEqual('undefined');
	});

	it('should accept final class delcarations', function() {
	  
		Class('Final Fantasy');
		
		expect(function() {
			Class('Rpg', {
				Extends: Fantasy
			});
		}).toThrow();
	  
	});

	it('should accept abstract class delcarations', function() {
	  
		Class('Abstract Painting');

		expect(function() {
			new Painting();
		}).toThrow();

	});

	it('should allow for a Singleton', function() {
	  
		Class('Application', {
			Singleton: true
		});
		
		expect(typeof Application.getInstance).toEqual('function');
		expect(Application.getInstance() instanceof Application).toEqual(true);
	});

	it('should create a Singleton that always returns the same instance', function() {
	  
		Class('Application', {
			Singleton: true
		});
		
		var a = Application.getInstance();
		var b = Application.getInstance();

		expect(a).toBe(b);
	});
});
