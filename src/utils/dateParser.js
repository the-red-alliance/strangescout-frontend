/**
 * Taken from https://weblog.west-wind.com/posts/2014/jan/06/javascript-json-date-parsing-and-real-dates
 * parses date objects from JSON
 */

var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

export function dateParser(key, value) {
	if (typeof value === 'string') {
		var a = reISO.exec(value);
		if (a) return new Date(value);
	}
	return value;
};

export default dateParser;