!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.WPCOM=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var Me = _dereq_('./lib/me');
var Sites = _dereq_('./lib/sites');
var ends = _dereq_('./lib/endpoint');
var debug = _dereq_('debug')('wpcom');

/**
 * WordPress.com REST API class.
 *
 * @api public
 */

function WPCOM(request){
  if (!(this instanceof WPCOM)) return new WPCOM(request);
  if ('function' !== typeof request) {
    throw new TypeError('a `request` WP.com function must be passed in');
  }
  this.request = request;
}

/**
 * Get me object instance
 *
 * @api public
 */

WPCOM.prototype.me = function(){
  return new Me(this);
};

/**
 * Get site object instance
 *
 * @param {String} id
 * @api public
 */

WPCOM.prototype.sites = function(id){
  return new Sites(id, this);
};

/**
 * List Freshly Pressed Posts
 *
 * @param {Object} params (optional)
 * @param {Function} fn callback function
 * @api public
 */

WPCOM.prototype.freshlyPressed = function(params, fn){
  this.sendRequest('freshly-pressed.get', null, params, fn);
};

/**
 * Request to WordPress REST API
 *
 * @param {String} type endpoint type
 * @param {Object} vars to build endpoint
 * @param {Object} params
 * @param {Function} fn
 * @api private
 */

WPCOM.prototype.sendRequest = function (type, vars, params, fn){
  debug('sendRequest("%s")', type);

  // params.query || callback function
  if ('function' == typeof params.query) {
    fn = params.query;
    params.query = {};
  }

  if (!fn) fn = function(err){ if (err) throw err; };

  // endpoint config object
  var end = ends(type);

  // request method
  params.method = (params.method || end.method || 'GET').toUpperCase();

  // build endpoint url
  var endpoint = end.path;
  if (vars) {
    for (var k in vars) {
      var rg = new RegExp("%" + k + "%");
      endpoint = endpoint.replace(rg, vars[k]);
    }
  }
  params.path = endpoint;
  debug('endpoint: `%s`', endpoint);

  this.request(params, fn);
};

/**
 * Expose `WPCOM` module
 */

module.exports = WPCOM;

},{"./lib/endpoint":3,"./lib/me":8,"./lib/sites":11,"debug":13}],2:[function(_dereq_,module,exports){
module.exports={
  "get": {
    "method": "GET",
    "path": "/freshly-pressed"
  }
}

},{}],3:[function(_dereq_,module,exports){

/**
 * Module dependencies
 */

var merge = _dereq_('extend');
var debug = _dereq_('debug')('wpcom:endpoint');
var dot = _dereq_('dot-component');

/**
 * Endpoint default options
 */

var endpoint_options = {};

/**
 * endpoints object
 */

var endpoints = {
  me: _dereq_('./me'),
  post: _dereq_('./post'),
  media: _dereq_('./media'),
  sites: _dereq_('./sites'),
  'freshly-pressed': _dereq_('./freshly-pressed')
};

/**
 * Expose module
 */

module.exports = endpoint;

/**
 * Return the endpoint object given the endpoint type
 *
 * @param {String} type
 * @return {Object}
 * @api public
 */

function endpoint(type){
  if (!type) {
    throw new Error('`type` must be defined');
  }

  debug('getting endpoint for `%s`', type);
  var end = dot.get(endpoints, type);

  if (!end) {
    throw new Error(type + ' endpoint is not defined');
  }

  // re-build endpoint default options
  end.options = end.options || {};
  merge(end.options, endpoint_options);

  debug('endpoint found');
  return end;
}

},{"./freshly-pressed":2,"./me":4,"./media":5,"./post":6,"./sites":7,"debug":13,"dot-component":14,"extend":16}],4:[function(_dereq_,module,exports){
module.exports={
  "get": {
    "method": "GET",
    "path": "/me"
  },

  "sites": {
    "method": "GET",
    "path": "/me/sites"
  },

  "likes": {
    "method": "GET",
    "path": "/me/likes"
  },

  "groups": {
    "method": "GET",
    "path": "/me/groups"
  },

  "connections": {
    "method": "GET",
    "path": "/me/connections"
  }
}

},{}],5:[function(_dereq_,module,exports){
module.exports=
{
  "get": {
    "method": "GET",
    "path": "/sites/%site%/media/%media_id%"
  },

  "add": {
    "method": "POST",
    "path": "/sites/%site%/media/new"
  },

  "update": {
    "method": "POST",
    "path": "/sites/%site%/media/%media_id%"
  },

  "delete": {
    "method": "POST",
    "path": "/sites/%site%/media/%media_id%/delete"
  }
}

},{}],6:[function(_dereq_,module,exports){
module.exports={
  "get": {
    "method": "GET",
    "path": "/sites/%site%/posts/%post_id%"
  },

  "get_by_slug": {
    "method": "GET",
    "path": "/sites/%site%/posts/slug:%post_slug%"
  },

  "add": {
    "method": "POST",
    "path": "/sites/%site%/posts/new"
  },

  "update": {
    "method": "POST",
    "path": "/sites/%site%/posts/%post_id%"
  },

  "delete": {
    "method": "POST",
    "path": "/sites/%site%/posts/%post_id%/delete"
  },

  "likes": {
    "method": "GET",
    "path": "/sites/%site%/posts/%post_id%/likes"
  }
}

},{}],7:[function(_dereq_,module,exports){
module.exports={
  "get": {
    "method": "GET",
    "path": "/sites/%site%"
  },

  "posts": {
    "get": {
      "method": "GET",
      "path": "/sites/%site%/posts"
    }
  },

  "medias": {
    "get": {
      "method": "GET",
      "path": "/sites/%site%/media"
    }
  }
}

},{}],8:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var debug = _dereq_('debug')('wpcom:me');

/**
 * Create a `Me` instance
 *
 * @param {WPCOM} wpcom
 * @api public
 */

function Me(wpcom){
  if (!(this instanceof Me)) return new Me(wpcom);
  this.wpcom = wpcom;
}

/**
 * Meta data about auth token's User
 *
 * @param {Object} [query]
 * @param {Function} fn
 * @api public
 */

Me.prototype.get = function(query, fn){
  this.wpcom.sendRequest('me.get', null, { query: query }, fn);
};

/**
 * A list of the current user's sites
 *
 * @param {Object} [query]
 * @param {Function} fn
 * @api private
 */

Me.prototype.sites = function(query, fn){
  this.wpcom.sendRequest('me.sites', null, { query: query }, fn);
};

/**
 * List the currently authorized user's likes
 *
 * @param {Object} [query]
 * @param {Function} fn
 * @api public
 */

Me.prototype.likes = function(query, fn){
  this.wpcom.sendRequest('me.likes', null, { query: query }, fn);
};

/**
 * A list of the current user's group
 *
 * @param {Object} [query]
 * @param {Function} fn
 * @api public
 */

Me.prototype.groups = function(query, fn){
  this.wpcom.sendRequest('me.groups', null, { query: query }, fn);
};

/**
 * A list of the current user's connections to third-party services
 *
 * @param {Object} [query]
 * @param {Function} fn
 * @api public
 */

Me.prototype.connections = function(query, fn){
  this.wpcom.sendRequest('me.connections', null, { query: query }, fn);
};

/**
 * Expose `Me` module
 */

module.exports = Me;

},{"debug":13}],9:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var debug = _dereq_('debug')('wpcom:media');

/**
 * Media methods
 *
 * @param {String} id
 * @param {String} sid site id
 * @param {WPCOM} wpcom
 * @api public
 */

function Media(id, sid, wpcom){
  if (!(this instanceof Media)) return new Media(id, sid, wpcom);

  this.wpcom = wpcom;
  this._sid = sid;
  this._id = id;

  if (!this._id) {
    debug('WARN: media id is not defined');
  }
}

/**
 * Get media
 *
 * @param {Object} [params]
 * @param {Function} fn
 * @api public
 */

Media.prototype.get = function(params, fn){
  var set = { site: this._sid, media_id: this._id };
  this.wpcom.sendRequest('media.get', set, params, fn);
};

/**
 * Add media
 *
 * @param {Object} body
 * @param {Function} fn
 * @api public
 */

Media.prototype.add = function(body, fn){
  var set = { site: this._sid };
  this.wpcom.sendRequest('media.add', set, { body: body }, fn);
};

/**
 * Edit media
 *
 * @param {Object} body
 * @param {Function} fn
 * @api public
 */

Media.prototype.update = function(body, fn){
  var set = { site: this._sid, media_id: this._id };
  this.wpcom.sendRequest('media.update', set, { body: body }, fn);
};

/**
 * Delete media
 *
 * @param {Function} fn
 * @api public
 */

Media.prototype.delete = function(fn){
  var set = { site: this._sid, media_id: this._id };
  this.wpcom.sendRequest('media.delete', set, fn);
};

/**
 * Expose `Media` module
 */

module.exports = Media;

},{"debug":13}],10:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var debug = _dereq_('debug')('wpcom:post');

/**
 * Post methods
 *
 * @param {String} id
 * @param {String} sid site id
 * @param {WPCOM} wpcom
 * @api public
 */

function Post(id, sid, wpcom){
  if (!(this instanceof Post)) return new Post(id, sid, wpcom);

  this.wpcom = wpcom;
  this._sid = sid;

  // set `id` and/or `slug` properties
  id = id || {};
  if ('object' != typeof id) {
    this._id = id;
  } else {
    this._id = id.id;
    this._slug = id.slug;
  }
}

/**
 * Set post `id`
 *
 * @api public
 */

Post.prototype.id = function(id){
  this._id = id;
};

/**
 * Set post `slug`
 *
 * @param {String} slug
 * @api public
 */

Post.prototype.slug = function(slug){
  this._slug = slug;
};

/**
 * Get post
 *
 * @param {Object} [params]
 * @param {Function} fn
 * @api public
 */

Post.prototype.get = function(params, fn){
  if (!this._id && this._slug) {
    return this.getbyslug(params, fn);
  }

  var set = { site: this._sid, post_id: this._id };
  this.wpcom.sendRequest('post.get', set, params, fn);
};

/**
 * Get post by slug
 *
 * @param {Object} [params]
 * @param {Function} fn
 * @api public
 */

Post.prototype.getbyslug =
Post.prototype.getBySlug = function(params, fn){
  var set = { site: this._sid, post_slug: this._slug };
  this.wpcom.sendRequest('post.get_by_slug', set, params, fn);
};

/**
 * Add post
 *
 * @param {Object} body
 * @param {Function} fn
 * @api public
 */

Post.prototype.add = function(body, fn){
  var set = { site: this._sid };
  this.wpcom.sendRequest('post.add', set, { body: body }, fn);
};

/**
 * Edit post
 *
 * @param {Object} body
 * @param {Function} fn
 * @api public
 */

Post.prototype.update = function(body, fn){
  var set = { site: this._sid, post_id: this._id };
  this.wpcom.sendRequest('post.update', set, { body: body }, fn);
};

/**
 * Delete post
 *
 * @param {Function} fn
 * @api public
 */

Post.prototype.delete = function(fn){
  var set = { site: this._sid, post_id: this._id };
  this.wpcom.sendRequest('post.delete', set, fn);
};

/**
 * Get post likes
 *
 * @param {Function} fn
 * @api public
 */

Post.prototype.likes = function(fn){
  var set = { site: this._sid, post_id: this._id };
  this.wpcom.sendRequest('post.likes', set, fn);
};

/**
 * Expose `Post` module
 */

module.exports = Post;

},{"debug":13}],11:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var Post = _dereq_('./post');
var Media = _dereq_('./media');
var debug = _dereq_('debug')('wpcom:sites');

/**
 * Create a Sites instance
 *
 * @param {WPCOM} wpcom
 * @api public
 */

function Sites(id, wpcom){
  if (!(this instanceof Sites)) return new Sites(id, wpcom);
  this.wpcom = wpcom;

  debug('set `%s` site id', id);
  this._id = id;
}

/**
 * Require site information
 *
 * @param {Object} [query]
 * @param {Function} fn
 * @api public
 */

Sites.prototype.get = function(query, fn){
  if (!this._id) {
    return fn(new Error('site `id` is not defined'));
  }

  var set = { site: this._id };
  this.wpcom.sendRequest('sites.get', set, { query: query }, fn);
};

/**
 * Require posts site
 *
 * @param {Object} [query]
 * @param {Function} fn
 * @api public
 */

Sites.prototype.posts = function(query, fn){
  if (!this._id) {
    return fn(new Error('site `id` is not defined'));
  }

  var set = { site: this._id };
  this.wpcom.sendRequest('sites.posts.get', set, { query: query }, fn);
};

/**
 * Require the media library
 *
 * @param {Object} [query]
 * @param {Function} fn
 * @api public
 */

Sites.prototype.medias = function(query, fn){
  if (!this._id) {
    return fn(new Error('site `id` is not defined'));
  }

  var set = { site: this._id };
  this.wpcom.sendRequest('sites.medias.get', set, { query: query }, fn);
};

/**
 * Create a `Post` instance
 *
 * @param {String} id
 * @api public
 */

Sites.prototype.post = function(id){
  return Post(id, this._id, this.wpcom);
};

/**
 * Add a new blog post
 *
 * @param {Object} body
 * @param {Function} fn
 * @return {Post} new Post instance
 */

Sites.prototype.addPost = function(body, fn){
  var post = Post(null, this._id, this.wpcom);
  post.add(body, fn);
  return post;
};

/**
 * Delete a blog post
 *
 * @param {String} id
 * @param {Function} fn
 * @return {Post} remove Post instance
 */

Sites.prototype.deletePost = function(id, fn){
  var post = Post(id, this._id, this.wpcom);
  post.delete(fn);
  return post;
};

/**
 * Create a `Media` instance
 *
 * @param {String} id
 * @api public
 */

Sites.prototype.media = function(id){
  return Media(id, this._id, this.wpcom);
};

/**
 * Add a new blog media body
 *
 * @param {Object} body
 * @param {Function} fn
 * @return {Post} new Post instance
 */

Sites.prototype.addMedia = function(body, fn){
  var media = Media(null, this._id, this.wpcom);
  media.add(body, fn);
  return media;
};

/**
 * Expose `Sites` module
 */

module.exports = Sites;

},{"./media":9,"./post":10,"debug":13}],12:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.once = noop;
process.off = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],13:[function(_dereq_,module,exports){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    fmt = coerce(fmt);

    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

/**
 * Coerce `val`.
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

// persist

try {
  if (window.localStorage) debug.enable(localStorage.debug);
} catch(e){}

},{}],14:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var type = _dereq_('type-component');

/**
 * Gets a certain `path` from the `obj`.
 *
 * @param {Object} target
 * @param {String} key
 * @return {Object} found object, or `undefined
 * @api public
 */

exports.get = function(obj, path){
  if (~path.indexOf('.')) {
    var par = parent(obj, path);
    var mainKey = path.split('.').pop();
    var t = type(par);
    if ('object' == t || 'array' == t) return par[mainKey];
  } else {
    return obj[path];
  }
};

/**
 * Sets the given `path` to `val` in `obj`.
 *
 * @param {Object} target
 * @Param {String} key
 * @param {Object} value
 * @api public
 */

exports.set = function(obj, path, val){
  if (~path.indexOf('.')) {
    var par = parent(obj, path, true);
    var mainKey = path.split('.').pop();
    if (par && 'object' == type(par)) par[mainKey] = val;
  } else {
    obj[path] = val;
  }
};

/**
 * Gets the parent object for a given key (dot notation aware).
 *
 * - If a parent object doesn't exist, it's initialized.
 * - Array index lookup is supported
 *
 * @param {Object} target object
 * @param {String} key
 * @param {Boolean} true if it should initialize the path
 * @api public
 */

exports.parent = parent;

function parent(obj, key, init){
  if (~key.indexOf('.')) {
    var pieces = key.split('.');
    var ret = obj;

    for (var i = 0; i < pieces.length - 1; i++) {
      // if the key is a number string and parent is an array
      if (Number(pieces[i]) == pieces[i] && 'array' == type(ret)) {
        ret = ret[pieces[i]];
      } else if ('object' == type(ret)) {
        if (init && !ret.hasOwnProperty(pieces[i])) {
          ret[pieces[i]] = {};
        }
        if (ret) ret = ret[pieces[i]];
      }
    }

    return ret;
  } else {
    return obj;
  }
}

},{"type-component":15}],15:[function(_dereq_,module,exports){

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val === Object(val)) return 'object';

  return typeof val;
};

},{}],16:[function(_dereq_,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

function isPlainObject(obj) {
	if (!obj || toString.call(obj) !== '[object Object]' || obj.nodeType || obj.setInterval)
		return false;

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method)
		return false;

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for ( key in obj ) {}

	return key === undefined || hasOwn.call( obj, key );
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
	    target = arguments[0] || {},
	    i = 1,
	    length = arguments.length,
	    deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && typeof target !== "function") {
		target = {};
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = Array.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];

					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

},{}],17:[function(_dereq_,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],18:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var uid = _dereq_('uid');
var event = _dereq_('component-event');
var Promise = _dereq_('promise');
var debug = _dereq_('debug')('wpcom-proxy-request');

/**
 * Export `request` function.
 */

module.exports = Promise.nodeify(request);

/**
 * WordPress.com REST API base endpoint.
 */

var proxyOrigin = 'https://public-api.wordpress.com';

/**
 * "Origin" of the current HTML page.
 */

var origin = window.location.protocol + '//' + window.location.hostname;
debug('using "origin": %s', origin);

/**
 * Reference to the <iframe> DOM element.
 * Gets set in the install() function.
 */

var iframe;

/**
 * Set to `true` upon the iframe's "load" event.
 */

var loaded = false;

/**
 * Array of buffered API requests. Added to when API requests are done before the
 * proxy <iframe> is "loaded", and fulfilled once the "load" DOM event on the
 * iframe occurs.
 */

var buffered;

/**
 * In-flight API request Promise instances.
 */

var requests = {};

/**
 * Performs a "proxied REST API request". This happens by calling
 * `iframe.postMessage()` on the proxy iframe instance, which from there
 * takes care of WordPress.com user authentication (via the currently
 * logged user's cookies).
 *
 * @param {Object|String} params
 * @api public
 */

function request (params) {
  debug('request()', params);

  if ('string' == typeof params) {
    params = { path: params };
  }

  // inject the <iframe> upon the first proxied API request
  if (!iframe) install();

  // generate a uid for this API request
  var id = uid();
  params.callback = id;
  params.supports_args = true; // supports receiving variable amount of arguments

  // force uppercase "method" since that's what the <iframe> is expecting
  params.method = String(params.method || 'GET').toUpperCase();

  debug('params object:', params);

  var req = new Promise(function (resolve, reject) {
    if (loaded) {
      submitRequest(params, resolve, reject);
    } else {
      debug('buffering API request since proxying <iframe> is not yet loaded');
      buffered.push([ params, resolve, reject ]);
    }
  });

  // store the `params` object so that "onmessage" can access it again
  requests[id] = params;

  return req;
}

/**
 * Calls the postMessage() function on the <iframe>, and afterwards add the
 * `resolve` and `reject` functions to the "params" object (after it's been
 * serialized into the iframe context).
 *
 * @param {Object} params
 * @param {Function} resolve
 * @param {Function} reject
 * @api private
 */

function submitRequest (params, resolve, reject) {
  debug('sending API request to proxy <iframe>:', params);

  iframe.contentWindow.postMessage(params, proxyOrigin);

  // needs to be added after the `.postMessage()` call otherwise
  // a DOM error is thrown
  params.resolve = resolve;
  params.reject = reject;
}

/**
 * Injects the proxy <iframe> instance in the <body> of the current
 * HTML page.
 *
 * @api private
 */

function install () {
  debug('install()');
  if (iframe) uninstall();

  buffered = [];

  // listen to messages sent to `window`
  event.bind(window, 'message', onmessage);

  // create the <iframe>
  iframe = document.createElement('iframe');
  iframe.src = proxyOrigin + '/rest-proxy/#' + origin;
  iframe.style.display = 'none';

  // set `loaded` to true once the "load" event happens
  event.bind(iframe, 'load', onload);

  // inject the <iframe> into the <body>
  document.body.appendChild(iframe);
}

/**
 * The proxy <iframe> instance's "load" event callback function.
 *
 * @param {Event} e
 * @api private
 */

function onload (e) {
  debug('proxy <iframe> "load" event');
  loaded = true;

  // flush any buffered API calls
  for (var i = 0; i < buffered.length; i++) {
    submitRequest.apply(null, buffered[i]);
  }
  buffered = null;
}

/**
 * The main `window` object's "message" event callback function.
 *
 * @param {Event} e
 * @api private
 */

function onmessage (e) {
  debug('onmessage');

  // safeguard...
  if (e.origin !== proxyOrigin) {
    debug('ignoring message... %s !== %s', e.origin, proxyOrigin);
    return;
  }

  var data = e.data;
  if (!data || !data.length) {
    debug('`e.data` doesn\'t appear to be an Array, bailing...');
    return;
  }

  var id = data[data.length - 1];
  var params = requests[id];
  delete requests[id];

  var res = data[0];
  var statusCode = data[1];
  var headers = data[2];
  debug('got %s status code for URL: %s', statusCode, params.path);

  if (res && headers) {
    res._headers = headers;
  }

  if (null == statusCode || 2 === Math.floor(statusCode / 100)) {
    // 2xx status code, success
    params.resolve(res);
  } else {
    // any other status code is a failure
    var err = new Error();
    err.statusCode = statusCode;
    for (var i in res) err[i] = res[i];
    if (res.error) err.name = toTitle(res.error) + 'Error';

    params.reject(err);
  }
}

function toTitle (str) {
  if (!str || 'string' !== typeof str) return '';
  return str.replace(/((^|_)[a-z])/g, function ($1) {
    return $1.toUpperCase().replace('_', '');
  });
}

},{"component-event":19,"debug":13,"promise":21,"uid":23}],19:[function(_dereq_,module,exports){
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};
},{}],20:[function(_dereq_,module,exports){
'use strict';

var asap = _dereq_('asap')

module.exports = Promise
function Promise(fn) {
  if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new')
  if (typeof fn !== 'function') throw new TypeError('not a function')
  var state = null
  var value = null
  var deferreds = []
  var self = this

  this.then = function(onFulfilled, onRejected) {
    return new Promise(function(resolve, reject) {
      handle(new Handler(onFulfilled, onRejected, resolve, reject))
    })
  }

  function handle(deferred) {
    if (state === null) {
      deferreds.push(deferred)
      return
    }
    asap(function() {
      var cb = state ? deferred.onFulfilled : deferred.onRejected
      if (cb === null) {
        (state ? deferred.resolve : deferred.reject)(value)
        return
      }
      var ret
      try {
        ret = cb(value)
      }
      catch (e) {
        deferred.reject(e)
        return
      }
      deferred.resolve(ret)
    })
  }

  function resolve(newValue) {
    try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.')
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then
        if (typeof then === 'function') {
          doResolve(then.bind(newValue), resolve, reject)
          return
        }
      }
      state = true
      value = newValue
      finale()
    } catch (e) { reject(e) }
  }

  function reject(newValue) {
    state = false
    value = newValue
    finale()
  }

  function finale() {
    for (var i = 0, len = deferreds.length; i < len; i++)
      handle(deferreds[i])
    deferreds = null
  }

  doResolve(fn, resolve, reject)
}


function Handler(onFulfilled, onRejected, resolve, reject){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
  this.onRejected = typeof onRejected === 'function' ? onRejected : null
  this.resolve = resolve
  this.reject = reject
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, onFulfilled, onRejected) {
  var done = false;
  try {
    fn(function (value) {
      if (done) return
      done = true
      onFulfilled(value)
    }, function (reason) {
      if (done) return
      done = true
      onRejected(reason)
    })
  } catch (ex) {
    if (done) return
    done = true
    onRejected(ex)
  }
}

},{"asap":22}],21:[function(_dereq_,module,exports){
'use strict';

//This file contains then/promise specific extensions to the core promise API

var Promise = _dereq_('./core.js')
var asap = _dereq_('asap')

module.exports = Promise

/* Static Functions */

function ValuePromise(value) {
  this.then = function (onFulfilled) {
    if (typeof onFulfilled !== 'function') return this
    return new Promise(function (resolve, reject) {
      asap(function () {
        try {
          resolve(onFulfilled(value))
        } catch (ex) {
          reject(ex);
        }
      })
    })
  }
}
ValuePromise.prototype = Object.create(Promise.prototype)

var TRUE = new ValuePromise(true)
var FALSE = new ValuePromise(false)
var NULL = new ValuePromise(null)
var UNDEFINED = new ValuePromise(undefined)
var ZERO = new ValuePromise(0)
var EMPTYSTRING = new ValuePromise('')

Promise.from = Promise.cast = function (value) {
  if (value instanceof Promise) return value

  if (value === null) return NULL
  if (value === undefined) return UNDEFINED
  if (value === true) return TRUE
  if (value === false) return FALSE
  if (value === 0) return ZERO
  if (value === '') return EMPTYSTRING

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then
      if (typeof then === 'function') {
        return new Promise(then.bind(value))
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex)
      })
    }
  }

  return new ValuePromise(value)
}
Promise.denodeify = function (fn, argumentCount) {
  argumentCount = argumentCount || Infinity
  return function () {
    var self = this
    var args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve, reject) {
      while (args.length && args.length > argumentCount) {
        args.pop()
      }
      args.push(function (err, res) {
        if (err) reject(err)
        else resolve(res)
      })
      fn.apply(self, args)
    })
  }
}
Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null
    try {
      return fn.apply(this, arguments).nodeify(callback)
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) { reject(ex) })
      } else {
        asap(function () {
          callback(ex)
        })
      }
    }
  }
}

Promise.all = function () {
  var args = Array.prototype.slice.call(arguments.length === 1 && Array.isArray(arguments[0]) ? arguments[0] : arguments)

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([])
    var remaining = args.length
    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then
          if (typeof then === 'function') {
            then.call(val, function (val) { res(i, val) }, reject)
            return
          }
        }
        args[i] = val
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex)
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i])
    }
  })
}

/* Prototype Methods */

Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this
  self.then(null, function (err) {
    asap(function () {
      throw err
    })
  })
}

Promise.prototype.nodeify = function (callback) {
  if (callback === null || typeof callback == 'undefined') return this

  this.then(function (value) {
    asap(function () {
      callback(null, value)
    })
  }, function (err) {
    asap(function () {
      callback(err)
    })
  })
}

Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
}


Promise.resolve = function (value) {
  return new Promise(function (resolve) { 
    resolve(value);
  });
}

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) { 
    reject(value);
  });
}

Promise.race = function (values) {
  return new Promise(function (resolve, reject) { 
    values.map(function(value){
      Promise.cast(value).then(resolve, reject);
    })
  });
}

},{"./core.js":20,"asap":22}],22:[function(_dereq_,module,exports){
(function (process){

// Use the fastest possible means to execute a task in a future turn
// of the event loop.

// linked list of tasks (single, with head node)
var head = {task: void 0, next: null};
var tail = head;
var flushing = false;
var requestFlush = void 0;
var isNodeJS = false;

function flush() {
    /* jshint loopfunc: true */

    while (head.next) {
        head = head.next;
        var task = head.task;
        head.task = void 0;
        var domain = head.domain;

        if (domain) {
            head.domain = void 0;
            domain.enter();
        }

        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function() {
                   throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    flushing = false;
}

if (typeof process !== "undefined" && process.nextTick) {
    // Node.js before 0.9. Note that some fake-Node environments, like the
    // Mocha test runner, introduce a `process` global without a `nextTick`.
    isNodeJS = true;

    requestFlush = function () {
        process.nextTick(flush);
    };

} else if (typeof setImmediate === "function") {
    // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
    if (typeof window !== "undefined") {
        requestFlush = setImmediate.bind(window, flush);
    } else {
        requestFlush = function () {
            setImmediate(flush);
        };
    }

} else if (typeof MessageChannel !== "undefined") {
    // modern browsers
    // http://www.nonblocking.io/2011/06/windownexttick.html
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    requestFlush = function () {
        channel.port2.postMessage(0);
    };

} else {
    // old browsers
    requestFlush = function () {
        setTimeout(flush, 0);
    };
}

function asap(task) {
    tail = tail.next = {
        task: task,
        domain: isNodeJS && process.domain,
        next: null
    };

    if (!flushing) {
        flushing = true;
        requestFlush();
    }
};

module.exports = asap;


}).call(this,_dereq_("/Users/nrajlich/wpcom.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/Users/nrajlich/wpcom.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":12}],23:[function(_dereq_,module,exports){
/**
 * Export `uid`
 */

module.exports = uid;

/**
 * Create a `uid`
 *
 * @param {String} len
 * @return {String} uid
 */

function uid(len) {
  len = len || 7;
  return Math.random().toString(35).substr(2, len);
}

},{}],24:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var _WPCOM = _dereq_('./index.js');
var request = _dereq_('wpcom-proxy-request');
var inherits = _dereq_('inherits');

/**
 * Module exports.
 */

module.exports = WPCOM;

/**
 * WordPress.com REST API class.
 *
 * Utilizes the proxy <iframe> technique for API access method
 * and cookie-based authentication.
 *
 * @api public
 */

function WPCOM () {
  if (!(this instanceof WPCOM)) return new WPCOM();
  _WPCOM.call(this, request);
}
inherits(WPCOM, _WPCOM);

},{"./index.js":1,"inherits":17,"wpcom-proxy-request":18}]},{},[24])
(24)
});