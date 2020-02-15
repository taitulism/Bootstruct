const {STATUS_CODES} = require('http');

const NOT_FOUND = 404;

module.exports = function getIoClass () {
	class IO {
		constructor (req, res) {
			this.ctrl   = null;
			this.req    = req;
			this.res    = res;
			this.states = Object.create(null);
			this.params = splitPath(req.url);
		}

		next () {
			this.ctrl.next(this);
		}

         /*
		 | This function gets overriden by the "io.exit" hook.
		*/
		exit () {
			const {res} = this;

			// .finished is depracated since v13.4.0. Use writableFinished/writableEnded.
			if (res.finished) return;
			if (res.headersSent) return res.end();

			res.writeHead(NOT_FOUND, STATUS_CODES[NOT_FOUND]);
			res.end();
		}
	}

	return IO;
};


/*
  ┌──────────────────────────────────────────
  │ accepts a full url and returns an array
  │
  │ ignores qryStr
  │	merges repeating slashes
  │	trim preceding & trailing slashes
  │	split by /
  │
 */
function splitPath (url) {
	// split by ? and take the first part
	let [path] = url.split('?');

	// replace multi slashes with one
	path = path.replace(/\/{2,}/gu, '/');

	// remove preceding slash
	path = path.substr(1);

	const len = path.length;

	// remove trailing slash
	if (path.charAt(len - 1) === '/') {
		path = path.substring(0, len - 1);
	}

	return path.split('/');
}
