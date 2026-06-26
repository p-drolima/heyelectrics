window.cfields = {"12":"post_code","21":"additional_information"};

window._show_thank_you = function(id, message, trackcmp_url, email) {
	var form = document.getElementById('_form_' + id + '_'), thank_you = form.querySelector('._form-thank-you');
	form.querySelector('._form-content').style.display = 'none';
	thank_you.innerHTML = message;
	thank_you.style.display = 'block';
	const vgoAlias = typeof visitorGlobalObjectAlias === 'undefined' ? 'vgo' : visitorGlobalObjectAlias;
	var visitorObject = window[vgoAlias];
	if (email && typeof visitorObject !== 'undefined') {
		visitorObject('setEmail', email);
		visitorObject('update');
	} else if (typeof(trackcmp_url) != 'undefined' && trackcmp_url) {
		_load_script(trackcmp_url);
	}
	if (typeof window._form_callback !== 'undefined') window._form_callback(id);
	thank_you.setAttribute('tabindex', '-1');
	thank_you.focus();
};

window._show_error = function(id, message, html) {
	var form = document.getElementById('_form_' + id + '_'),
		err = document.createElement('div'),
		button = form.querySelector('button[type="submit"]'),
		old_error = form.querySelector('._form_error');
	if (old_error) old_error.parentNode.removeChild(old_error);
	err.innerHTML = message;
	err.className = '_error-inner _form_error _no_arrow';
	var wrapper = document.createElement('div');
	wrapper.className = '_form-inner _show_be_error';
	wrapper.appendChild(err);
	button.parentNode.insertBefore(wrapper, button);
	var submitButton = form.querySelector('[id^="_form"][id$="_submit"]');
	submitButton.disabled = false;
	submitButton.classList.remove('processing');
	if (html) {
		var div = document.createElement('div');
		div.className = '_error-html';
		div.innerHTML = html;
		err.appendChild(div);
	}
};

window._load_script = function(url, callback, isSubmit) {
	var head = document.querySelector('head'), script = document.createElement('script'), r = false;
	var submitButton = document.querySelector('#_form_9_submit');
	script.charset = 'utf-8';
	script.src = url;
	if (callback) {
		script.onload = script.onreadystatechange = function() {
			if (!r && (!this.readyState || this.readyState == 'complete')) {
				r = true;
				callback();
			}
		};
	}
	script.onerror = function() {
		if (isSubmit) {
			if (script.src.length > 10000) {
				_show_error("9", "Sorry, your submission failed. Please shorten your responses and try again.");
			} else {
				_show_error("9", "Sorry, your submission failed. Please try again.");
			}
			submitButton.disabled = false;
			submitButton.classList.remove('processing');
		}
	};
	head.appendChild(script);
};

(function() {
	if (window.location.search.search("excludeform") !== -1) return false;

	var getCookie = function(name) {
		var match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
		return match ? match[2] : localStorage.getItem(name);
	};

	var setCookie = function(name, value) {
		var now = new Date();
		var time = now.getTime();
		var expireTime = time + 1000 * 60 * 60 * 24 * 365;
		now.setTime(expireTime);
		document.cookie = name + '=' + value + '; expires=' + now + ';path=/; Secure; SameSite=Lax;';
		localStorage.setItem(name, value);
	};

	var addEvent = function(element, event, func) {
		if (element.addEventListener) {
			element.addEventListener(event, func);
		} else {
			var oldFunc = element['on' + event];
			element['on' + event] = function() {
				oldFunc.apply(this, arguments);
				func.apply(this, arguments);
			};
		}
	};

	var _removed = false;
	var form_to_submit = document.getElementById('_form_9_');

	if (!form_to_submit) return;

	var allInputs = form_to_submit.querySelectorAll('input, select, textarea'), tooltips = [], submitted = false;

	var getUrlParam = function(name) {
		if (name.toLowerCase() !== 'email') {
			var params = new URLSearchParams(window.location.search);
			return params.get(name) || false;
		}
		var qString = window.location.search;
		if (!qString) return false;
		var parameters = qString.substr(1).split('&');
		for (var i = 0; i < parameters.length; i++) {
			var parameter = parameters[i].split('=');
			if (parameter[0].toLowerCase() === 'email') {
				return parameter[1] === undefined ? true : decodeURIComponent(parameter[1]);
			}
		}
		return false;
	};

	for (var i = 0; i < allInputs.length; i++) {
		var regexStr = "field\\[(\\d+)\\]";
		var results = new RegExp(regexStr).exec(allInputs[i].name);
		if (results != undefined) {
			allInputs[i].dataset.name = allInputs[i].name.match(/\[time\]$/)
				? window.cfields[results[1]] + '_time'
				: window.cfields[results[1]];
		} else {
			allInputs[i].dataset.name = allInputs[i].name;
		}
		var fieldVal = getUrlParam(allInputs[i].dataset.name);
		if (fieldVal) {
			if (allInputs[i].dataset.autofill === "false") continue;
			if (allInputs[i].type == "radio" || allInputs[i].type == "checkbox") {
				if (allInputs[i].value == fieldVal) allInputs[i].checked = true;
			} else {
				allInputs[i].value = fieldVal;
			}
		}
	}

	var remove_tooltips = function() {
		for (var i = 0; i < tooltips.length; i++) {
			tooltips[i].tip.parentNode.removeChild(tooltips[i].tip);
		}
		tooltips = [];
	};

	var remove_tooltip = function(elem) {
		for (var i = 0; i < tooltips.length; i++) {
			if (tooltips[i].elem === elem) {
				tooltips[i].tip.parentNode.removeChild(tooltips[i].tip);
				tooltips.splice(i, 1);
				return;
			}
		}
	};

	var create_tooltip = function(elem, text) {
		var tooltip = document.createElement('div'),
			arrow = document.createElement('div'),
			inner = document.createElement('div'), new_tooltip = {};
		tooltip.id = elem.id + '-error';
		tooltip.setAttribute('role', 'alert');
		if (elem.type != 'radio' && (elem.type != 'checkbox' || elem.name === 'sms_consent')) {
			tooltip.className = '_error';
			arrow.className = '_error-arrow';
			inner.className = '_error-inner';
			inner.innerHTML = text;
			tooltip.appendChild(arrow);
			tooltip.appendChild(inner);
			elem.parentNode.appendChild(tooltip);
		} else {
			tooltip.className = '_error-inner _no_arrow';
			tooltip.innerHTML = text;
			elem.parentNode.insertBefore(tooltip, elem);
			new_tooltip.no_arrow = true;
		}
		new_tooltip.tip = tooltip;
		new_tooltip.elem = elem;
		tooltips.push(new_tooltip);
		return new_tooltip;
	};

	var resize_tooltip = function(tooltip) {
		var rect = tooltip.elem.getBoundingClientRect();
		var doc = document.documentElement,
			scrollPosition = rect.top - ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0));
		if (scrollPosition < 40) {
			tooltip.tip.className = tooltip.tip.className.replace(/ ?(_above|_below) ?/g, '') + ' _below';
		} else {
			tooltip.tip.className = tooltip.tip.className.replace(/ ?(_above|_below) ?/g, '') + ' _above';
		}
	};

	var resize_tooltips = function() {
		if (_removed) return;
		for (var i = 0; i < tooltips.length; i++) {
			if (!tooltips[i].no_arrow) resize_tooltip(tooltips[i]);
		}
	};

	var validate_field = function(elem, remove) {
		var tooltip = null, value = elem.value, no_error = true;
		remove ? remove_tooltip(elem) : false;
		elem.removeAttribute('aria-invalid');
		elem.removeAttribute('aria-describedby');
		if (elem.type != 'checkbox') elem.className = elem.className.replace(/ ?_has_error ?/g, '');
		if (elem.getAttribute('required') !== null) {
			if (elem.type == 'radio' || (elem.type == 'checkbox' && /any/.test(elem.className))) {
				var elems = form_to_submit.elements[elem.name];
				if (!(elems instanceof NodeList || elems instanceof HTMLCollection) || elems.length <= 1) {
					no_error = elem.checked;
				} else {
					no_error = false;
					for (var i = 0; i < elems.length; i++) {
						if (elems[i].checked) no_error = true;
					}
				}
				if (!no_error) tooltip = create_tooltip(elem, "Please select an option.");
			} else if (elem.type == 'checkbox') {
				var elems = form_to_submit.elements[elem.name], found = false, err = [];
				no_error = true;
				for (var i = 0; i < elems.length; i++) {
					if (elems[i].getAttribute('required') === null) continue;
					if (!found && elems[i] !== elem) return true;
					found = true;
					elems[i].className = elems[i].className.replace(/ ?_has_error ?/g, '');
					if (!elems[i].checked) {
						no_error = false;
						elems[i].className = elems[i].className + ' _has_error';
						err.push("Checking %s is required".replace("%s", elems[i].value));
					}
				}
				if (!no_error) tooltip = create_tooltip(elem, err.join('<br/>'));
			} else if (elem.tagName == 'SELECT') {
				var selected = true;
				if (!elem.multiple) {
					for (var i = 0; i < elem.options.length; i++) {
						if (elem.options[i].selected && (!elem.options[i].value || elem.options[i].value.match(/\n/g))) {
							selected = false;
						}
					}
				}
				if (!selected) {
					elem.className = elem.className + ' _has_error';
					no_error = false;
					tooltip = create_tooltip(elem, "Please select an option.");
				}
			} else if (value === undefined || value === null || value === '') {
				elem.className = elem.className + ' _has_error';
				no_error = false;
				tooltip = create_tooltip(elem, "This field is required.");
			}
		}
		if (no_error && elem.name == 'email') {
			if (!value.match(/^[\+_a-z0-9-'&=]+(\.[\+_a-z0-9-']+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i)) {
				elem.className = elem.className + ' _has_error';
				no_error = false;
				tooltip = create_tooltip(elem, "Enter a valid email address.");
			}
		}
		// phone number format validation intentionally skipped — plain text field
		tooltip ? resize_tooltip(tooltip) : false;
		if (!no_error && elem.hasAttribute('id')) {
			elem.setAttribute('aria-invalid', 'true');
			elem.setAttribute('aria-describedby', elem.id + '-error');
		}
		return no_error;
	};

	var needs_validate = function(el) {
		if (el.getAttribute('required') !== null) return true;
		if ((el.name === 'email' || el.id === 'phone') && el.value !== "") return true;
		return false;
	};

	var validate_form = function(e) {
		var err = form_to_submit.querySelector('._form_error'), no_error = true;
		if (!submitted) {
			submitted = true;
			for (var i = 0, len = allInputs.length; i < len; i++) {
				var input = allInputs[i];
				if (needs_validate(input)) {
					if (input.type == 'text' || input.type == 'number' || input.type == 'time' || input.type == 'tel') {
						addEvent(input, 'blur', function() {
							this.value = this.value.trim();
							validate_field(this, true);
						});
						addEvent(input, 'input', function() {
							validate_field(this, true);
						});
					} else if (input.type == 'radio' || input.type == 'checkbox') {
						(function(el) {
							var radios = form_to_submit.elements[el.name];
							if (!Array.isArray(radios)) radios = [radios];
							for (var i = 0; i < radios.length; i++) {
								addEvent(radios[i], 'change', function() { validate_field(el, true); });
							}
						})(input);
					} else if (input.tagName == 'SELECT') {
						addEvent(input, 'change', function() { validate_field(this, true); });
					} else if (input.type == 'textarea') {
						addEvent(input, 'input', function() { validate_field(this, true); });
					}
				}
			}
		}
		remove_tooltips();
		for (var i = 0, len = allInputs.length; i < len; i++) {
			var elem = allInputs[i];
			if (needs_validate(elem)) {
				if (elem.tagName.toLowerCase() !== "select") elem.value = elem.value.trim();
				validate_field(elem) ? true : no_error = false;
			}
		}
		if (!no_error && e) e.preventDefault();
		if (!no_error) {
			var firstFocusableError = form_to_submit.querySelector('._has_error:not([disabled])');
			if (firstFocusableError && typeof firstFocusableError.focus === 'function') firstFocusableError.focus();
		}
		resize_tooltips();
		return no_error;
	};

	addEvent(window, 'resize', resize_tooltips);
	addEvent(window, 'scroll', resize_tooltips);

	var inputPhone = form_to_submit.querySelector("#phone");
	// intl-tel-input intentionally not initialised — plain text input used instead

	var _form_serialize = function(form){if(!form||form.nodeName!=="FORM"){return}var i,j,q=[];for(i=0;i<form.elements.length;i++){if(form.elements[i].name===""){continue}switch(form.elements[i].nodeName){case"INPUT":switch(form.elements[i].type){case"tel":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].previousSibling.querySelector('div.iti__selected-dial-code').innerText)+encodeURIComponent(" ")+encodeURIComponent(form.elements[i].value));break;case"text":case"number":case"date":case"time":case"hidden":case"password":case"button":case"reset":case"submit":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"checkbox":case"radio":if(form.elements[i].checked){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value))}break;case"file":break}break;case"TEXTAREA":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"SELECT":switch(form.elements[i].type){case"select-one":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"select-multiple":for(j=0;j<form.elements[i].options.length;j++){if(form.elements[i].options[j].selected){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].options[j].value))}}break}break;case"BUTTON":switch(form.elements[i].type){case"reset":case"submit":case"button":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break}break}}return q.join("&")};

	var form_submit = function(e) {
		e.preventDefault();
		if (validate_form()) {
			var submitButton = e.target.querySelector('#_form_9_submit');
			submitButton.disabled = true;
			submitButton.classList.add('processing');
			var serialized = _form_serialize(document.getElementById('_form_9_')).replace(/%0A/g, '\\n');
			var err = form_to_submit.querySelector('._form_error');
			err ? err.parentNode.removeChild(err) : false;
			_load_script('https://gas939.activehosted.com/proc.php?' + serialized + '&jsonp=true', null, true);
		}
		return false;
	};

	addEvent(form_to_submit, 'submit', form_submit);
})();

// Inline label error sync — replaces asterisk with error message, no layout shift
(function () {
	function initInlineErrors() {
		var form = document.getElementById('_form_9_');
		if (!form) return;

		// Store original label HTML so we can restore it on clear
		form.querySelectorAll('._form-label').forEach(function (label) {
			label.dataset.baseHtml = label.innerHTML;
		});

		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') return;
				var input = mutation.target;
				var formEl = input.closest && input.closest('._form_element');
				if (!formEl) return;
				var label = formEl.querySelector('._form-label');
				if (!label) return;

				if (input.classList.contains('_has_error')) {
					// Grab the error message AC already wrote into the hidden tooltip
					var errInner = formEl.querySelector('._error-inner');
					var msg = errInner ? errInner.textContent.trim() : 'Required';
					// Replace the required asterisk span with the error message
					var restored = label.dataset.baseHtml || label.innerHTML;
					var updated = restored.replace(
						/<span class="field-required">.*?<\/span>/,
						'<span class="ac-inline-error"> — ' + msg + '</span>'
					);
					label.innerHTML = updated;
				} else {
					// Restore original label with asterisk
					if (label.dataset.baseHtml) label.innerHTML = label.dataset.baseHtml;
				}
			});
		});

		form.querySelectorAll('input, textarea, select').forEach(function (input) {
			observer.observe(input, { attributes: true, attributeFilter: ['class'] });
		});
	}

	// Run after AC's own IIFE has finished initialising the form
	setTimeout(initInlineErrors, 200);
})();
