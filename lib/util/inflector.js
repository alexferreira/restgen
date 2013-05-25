var fleck = require('fleck');

for (method in fleck) exports[method] = fleck[method];

String.prototype.capitalize = function(str) {
  return fleck.capitalize(String(this))
};

String.prototype.camelize = function(str) {
  return fleck.camelize(String(this))
};

String.prototype.dasherize = function(str) {
  return fleck.dasherize(String(this))
};

String.prototype.underscore = function(str) {
  return fleck.underscore(String(this))
};

String.prototype.pluralize = function(str) {
  return fleck.pluralize(String(this))
};

String.prototype.strip = function(str) {
  return fleck.strip(String(this))
};

String.prototype.ordinalize = function(str) {
  return fleck.ordinalize(String(this))
};

/*
 * CapitalizedCamelCase
 */

exports.classify = function(str) {
  return fleck.camelize(str, true);
};

/*
 * users/update_avatar -> UsersUpdateAvatar
 */

exports.objectify /*lol*/ = function (str) { 
  str = str.replace(/\//g, '_');
  return exports.classify(str);
};

exports.humanize = function(str) {
  return fleck.capitalize(fleck.underscore(str).replace(/_/g, ' '));
};

