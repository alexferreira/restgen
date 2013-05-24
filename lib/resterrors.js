var sys = require('sys');
var baseObject = require('./baseobject');

var baseRestError = function() {
  var baseRestError = baseObject.extend({
    name: 'RestError',
    title: 'Rest Error',
    description: '',
    message: '',

    _construct: function(message){
      this.message = message;
      Error.call(this, message);
      Error.captureStackTrace(this, arguments.callee);
    },

    toString: function(){
      return this.title + ": " + this.message;
    }
  });

  sys.inherits(baseRestError, Error);
  
  return baseRestError;
}();

module.exports.BaseRestError = baseRestError;

module.exports.RestError = restError = {
  BadRequest: baseRestError.extend({
    name: 'BadRequest',
    title: 'Bad Request',
    description: 'The request could not be understood by the server due to malformed syntax.',
    httpStatus: 400
  }),
  NotFound: baseRestError.extend({
    name: 'NotFound',
    title: 'Not Found',
    description: 'The requested resource could not be found.',
    httpStatus: 404
  })
};

module.exports.ErrorMapper = errMapper = function() {
  return {
    'RestError': function(err, req, res){
      if (process.env.NODE_ENV == 'debug') console.log(err);
      res.render('restError/restError.jade', {
        status: err.httpStatus,
        err: err
      });
    },
    'default': function(err, req, res) {
      if (process.env.NODE_ENV == 'debug' || process.env.NODE_ENV == 'release') console.log(err);
      res.render('restError/500.jade', {
        status: 500,
        err: err
      });
    }
  }
}();

module.exports.ErrorHandler = function(err, req, res) {
  var constructorName = err.prototype ? err.prototype.constructor.name : 'default';
  var errHandler = errMapper[err.name] || errMapper[constructorName];

  errHandler(err, req, res);
};