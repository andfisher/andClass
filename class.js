/**
 * @desc andClass. A JavaScript Class definition library
 * @author Andrew Fisher
 * @copyright Copyright (c) 2017 Andrew Fisher (andfisher)
 * @version 0.1.0
 * @license The MIT License (MIT)
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */
 
(function(context) {

	'use strict';
	
	// Use $empty as a placeholder function when defining
	// Abstract classes with methods
	context.$empty = function(){};

	context.Class = function(name, config) {
	
		var instance;
	
		if (! config) config = {};
		
		function _extendProto(to, from) {
			if (from.prototype['final']) {
				throw 'Cannot extend a Final Class';
			}
			for (var i in from.prototype) {
				if (i.charAt(0) !== '_') {
					to.prototype[i] = from.prototype[i];
				}
			}
		}
		
		function _use(to, from) {
			for (var key in from) {
				to.prototype[key] = from[key].prototype;
			}
		}
		
		function _arrayCopy(original) {
			return original.slice();
		}
		
		var declaration = '';
		var matches = name.match(/^(Final|Abstract) (.+)$/i);
		if (matches && matches.length === 3) {
			declaration = matches[1];
			name = matches[2];
		}

		if (declaration.toLowerCase() === 'final') {
			config['final'] = true;
		}
	
		context[name] = function (settings) {
			if (declaration.toLowerCase() === 'abstract') {
				throw 'Cannot create an instance of an Abstract class';
			}
			// Need to copy any arrays from the class config to the
			// current instance so that the arrays aren't shared between
			// the prototypes
			for (var i in config) {
				if (Array.isArray(config[i])) {
					this[i] = _arrayCopy(config[i]);
				} 
			}
 
			for (var i in settings) {
				if (Array.isArray(settings[i])) {
					this[i] = settings[i];
				} else if (typeof settings[i] === 'function') {
					this[i] = settings[i].bind(this);
				} else {
					this[i] = settings[i];
				}
			}
		
			if (typeof this.init === 'function') {
				this.init.apply(this, arguments);
			}
		};
		
		var AndClass = context[name];

		if (config) {
		
			if (config.Extends) {

				// Extends can be a single Class reference, or an
				// Array of multiple Class references
				// NB: Use a polyfill for Array.prototype.isArray() if
				// browser coverage not sufficient. 
				if (Array.isArray(config.Extends)) {
					for (var i in config.Extends) {
						_extendProto(AndClass, config.Extends[i]);
					}
				} else {
					_extendProto(AndClass, config.Extends);
				}
				
				// Delete the `extend` key so that it is not copied
				// over to the prototype along with the methods and
				// members.
				delete config.Extends;
			}
			
			if (config.Uses) {
				if (Array.isArray(config.Uses)) {
					for (var i in config.Uses) {
						_use(AndClass, config.Uses[i]);
					}
				} else {
					_use(AndClass, config.Uses);
				}
				delete config.Uses;
			}
			
			if (config.Singleton) {
				AndClass.getInstance = function() {
					if (! instance) {
						instance = new context[name](config);
					}
					return instance;
				}
			}

			for (var i in config) {
				if (Array.isArray(config[i])) {
					// Don't want array to be shared via prototype, (unless it
					// is a Use[able] class. It will be overriden by an
					// individual instance's own property.
					AndClass.prototype[i] = config[i];
				} else {
					AndClass.prototype[i] = config[i];
				}
			}
		}

		return AndClass;
	}

})(window);