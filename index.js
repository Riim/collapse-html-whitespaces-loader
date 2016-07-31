var parse5 = require('parse5');
var walk5 = require('walk5');

var notProcessedTags = Object.create(null);
notProcessedTags.script = true;
notProcessedTags.styles = true;
notProcessedTags.pre = true;
notProcessedTags.textarea = true;

module.exports = function(content) {
	this.cacheable();

	var fragment = parse5.parseFragment(content);

	walk5.walk(fragment, function(node) {
		var nodeName = node.nodeName;

		if (nodeName == '#text') {
			node.value = node.value.replace(/\s+/g, ' ');
		} else if (nodeName in notProcessedTags) {
			return false;
		}
	});

	return parse5.serialize(fragment);
};
