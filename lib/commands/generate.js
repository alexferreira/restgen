var generators = require('../generators/index');
var message = require('../util/message');
var parseGeneratorCommand = require('../util/parseGeneratorCommand');

module.exports = function() {
  var env = parseGeneratorCommand([].slice.call(arguments, 0));
  if (!env.resourceName) {
    message.notify("restgen: Please provide a resource name. See 'restgen generate --help'");
  } else {
    for (var generator in generators) {
      if (env[generator]) {
        generators[generator](env.resourceName, env);
      }
    }
  }
};
