/*global define: false, window: false */
(function (factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// amd wrapper
		define([], factory);
	} else {
		// non amd wrapper
		window.Popup = factory;
	}

}(function (popup) {

	'use strict';

	/**
	 * A super simple popup
	 *
	 * @param {String | Object} content The content as either a string or an element
	 * @param {Object} options
	 *        - {Function} onSuccess: If defined what happens when the user clicks the 'OK' button
	 *        - {Function} onClose: Will fire whenever the popup is closed (even after onSuccess)
	 *        - {Function} validator: Takes a node list argument of all the fields
	 */
	var Popup = function (content, options) {
		// private members
		this._element = null;
		// overlay
		this._overlay = null;
		// popup content
		this._content = content;
		// close button
		this._close = null;
		// default options
		this._options = {
			onSuccess: false,
			onClose: function () {},
			onError: function () {},
			validator: function () {}
		};
		// extend the options
		for (var obj in this._options) {
			if (options && options[obj] !== undefined) {
				this._options[obj] = options[obj];
			}
		}
		// build the popup
		this.draw();
	};

	/**
	 * Remove the popup
	 *
	 * __This will not fire the onClose method__
	 */
	Popup.prototype.remove = function () {
		if (this.get('overlay') && this.get('overlay').parentNode) {
			this.get('overlay').parentNode.removeChild(this.get('overlay'));
		}
	};

	/**
	 * Draw the popup and insert the popup into the document.body
	 *
	 * @return {Object} Returns `this` which is suitable for chaining
	 */
	Popup.prototype.draw = function () {

		// main element
		var element = document.createElement('div');
		element.className = 'noodle_popup';

		// build the form wrapper
		var form = document.createElement('form');
		form.onsubmit = function () { return false; };
		element.appendChild(form);

		// close button
		var close = document.createElement('div');
		close.className = 'noodle_close';
		form.appendChild(close);

		// content
		var content = document.createElement('div');
		content.className = 'noodle_content';

		if (typeof this.get('content') === 'string') {
			// a string
			content.innerHTML = this.get('content');
		} else {
			// an HTML element
			content.appendChild(this.get('content'));
		}

		form.appendChild(content);

		// if we have a success option, draw the success dialog
		if (this.get('options').onSuccess) {
			this.success = document.createElement('input');
			this.success.type = 'submit';
			this.success.className = 'noodle_bttn blue';
			this.success.value = 'OK';
			form.appendChild(this.success);
		}

		// overlay
		var overlay = document.createElement('div');
		overlay.id = 'noodle_overlay';
		overlay.appendChild(element);

		document.body.appendChild(overlay);

		this.set('close', close);
		this.set('element', element);
		this.set('overlay', overlay);
		// now bind it all
		this.bind();
		return this;
	};

	/**
	 * Once we have finished rendering we need to bind all the event listeners
	 * 
	 * @return {[type]} [description]
	 */
	Popup.prototype.bind = function () {

		// when the user clicks somewhere else
		this.get('overlay').addEventListener('click', function (e) {
			if (e.target.id === 'noodle_overlay') {
				this.remove();
			}
		}.bind(this));

		// when enter is pressed
		this.enter = this.onSuccess.bind(this);
		document.body.addEventListener('keydown', this.enter);
		this.success.addEventListener('click', this.onSuccess.bind(this));

		// focus the first form element
		var input = this.get('element').querySelector('input');
		if (input) {
			input.focus();
		}

		this.get('close').addEventListener('click', function () {
			this.remove();
			this.get('options').onClose();
		}.bind(this));
	};

	/**
	 * What happens when we are successful (or think we are)
	 * 
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	Popup.prototype.onSuccess = function (e) {

		if (e.keyCode !== 13 && e.keyCode !== 0) {
			return;
		}

		// get all the form elements and cast to an array
		var elements = Array.prototype.slice.call(this.get('element').querySelectorAll('input:not([type="submit"]), textarea, select'), 0);

		// run the validators
		try {
			// custom validation
			this.get('options').validator(elements);
		} catch (err) {
			// reset all the validators
			elements.forEach(function (el) { el.setCustomValidity(''); });
			
			if (err.length !== undefined) {
				// reapply the ones we have
				err.forEach(function (error) {
					if (error.element) {
						error.element.setCustomValidity(error.message);
					}
				});
			} else {
				err.element.setCustomValidity(err.message);
			}

			this.get('options').onError(e);
			return;
		}

		this.get('options').onSuccess();
		this.get('options').onClose();
		this.remove();

		// remove the enter event
		document.body.removeEventListener('keydown', this.enter);
	};

	/**
	 * Get a property from the object
	 * 
	 * @param  {String} prop Looks in THIS for the property
	 * @throws {String} If this[prop] === undefined
	 * @return The value
	 */
	Popup.prototype.get = function (prop) {
		if (this['_' + prop] === undefined) {
			throw 'Woooahhh your trying to access ' + prop + ' property which doesn\'t exist';
		}
		return this['_' + prop];
	};

	/**
	 * Sets a property and return the new object
	 * 
	 * @param {String} prop  Set the property
	 * @param {Object} value The value to set
	 * @return {Object} This object, suitable for chaining
	 */
	Popup.prototype.set = function (prop, value) {
		this.get(prop);
		this['_' + prop] = value;		
		return this;
	};

	return Popup;
}));