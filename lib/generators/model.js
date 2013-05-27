var template = require('../util/template');
var inflector = require('../util/inflector');

module.exports = function(resource, env) {
  var resourceName = inflector.underscore(inflector.singularize(resource));

  template.generate('model', resourceName, {
    fields: env.fields,
    objectName: resourceName
  }, true);

  return template.generate('test', resourceName, {
    fields: env.fields,
    objectName: inflector.pluralize(resource),
    objectNamePlural: inflector.objectify(inflector.pluralize(resource)),
    objectNameSingular: inflector.objectify(inflector.singularize(resource))
  }, true);
};

