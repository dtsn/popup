Popup
=====

A super simple RequireJS, CommonJS compatible popup.

## Usage

`var p = new Popup(content, options)`

Where content is either an `DOMElement` object or an element ID and options is an object. There are four different options available:

**onSuccess** - A function that will be called when the user clicks the successbutton
**onClose** - A function called when the popup is closed
**onError** - A function called when the validation fails
**validator** - A function that will validate the field of the popup

## Modal Popup

By defining the `onSuccess` option of the popup an 'ok' button is appended to the bottom of the popup.

## Validation

The popup has inbuilt support of a validation method. The validation method will be passed an array containing all the form fields on the page. If you throw an error containing a `element` and `message` parameter this will use the browsers default error handling supported through `setCustomValidator`.

    var p = new Popup('<input type="text" name="name" />', {
    	onSuccess: function () {
    		alert('yay');
    	},
    	validation: function (fields) {
    		fields.forEach(function (field) {
    			if (field.value === '') {
    				throw {
    					'element': field,
    					'message': "This cannot be blank"
    				};
    			}
    		});
    	};
    });

## Popup Methods

### get

You can use the `get` method to get any property. For example you can fetch the element the popup creates.

    p.get('element').querySelector('div');

Will return all the divs in the popup. This is most handy with custom form logic.

### set

The opposite of `get` but I wouldn't know why you would want to set something.
