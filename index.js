var parse5 = require('parse5');
var walk5 = require('walk5');
var loaderUtils = require('loader-utils');

var notProcessedTags = Object.create(null);
notProcessedTags.script = true;
notProcessedTags.styles = true;
notProcessedTags.pre = true;
notProcessedTags.textarea = true;

module.exports = function(content) {
	this.cacheable();

	var query = loaderUtils.parseQuery(this.query);
	var fragment = parse5.parseFragment(content);

	var skipTags = notProcessedTags;

	if (query.skip) {
		skipTags = query.skip.split(',').reduce(function(skipTags, tagName) {
			skipTags[tagName] = true;
			return skipTags;
		}, Object.create(skipTags));
	}

	walk5.walk(fragment, function(node) {
		if (node.nodeName == '#text') {
			node.value = node.value.replace(/\s+/g, ' ');
		} else if (node.hasOwnProperty('tagName') && node.tagName in skipTags) {
			return false;
		}
	});

	return parse5.serialize(fragment);
};
