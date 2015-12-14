(function() {
  var Airbrake = require('airbrake'),
      _ = require('lodash'),
      util = require('util');

  var LogError = function(logger, message) {
    this.name = logger;
    this.message = message;
  };
  LogError.prototype = new Error();
  LogError.prototype.constructor = LogError;

  var LoggerAirbrakePlugin = function(configuration){
    var defaults = {
      apiKey: null,
      host: null,
      port: 80,
      protocol: 'http',
      notifyUncaughtException: false,
      developmentEnvironments: ['development', 'test'],
      appVersion: null
    };

    var config = _.defaults(configuration || {}, defaults);

    var airbrakeClient = Airbrake.createClient(config.apiKey);
    airbrakeClient.host = config.host;
    airbrakeClient.serviceHost = config.host;
    airbrakeClient.port = config.port;
    airbrakeClient.protocol = config.protocol;
    airbrakeClient.developmentEnvironments = config.developmentEnvironments;
    airbrakeClient.appVersion = config.appVersion;

    if (config.notifyUncaughtException){
      airbrakeClient.handleExceptions();
    }

    var notify = function(logger, error){
      error.component = logger;
      airbrakeClient.notify(error);
    };

    var getError = function(logger, args){

      var error = args[0];

      if(error instanceof Error){
        return error;
      }

      var msg = util.format.apply(util, args);
      return new LogError(logger, msg);
    };

    // public

    this.config = config;

    this.name = 'LoggerAirbrakePlugin';

    this.isDebug = function(){
      return false;
    }.bind(this);

    var doNothing = function(){ }.bind(this);

    this.debug = doNothing;

    this.trace = doNothing;

    this.info = doNothing;

    this.warn = doNothing;

    this.error = function(){
      var args = _.toArray(arguments);

      // remove logger name
      var logger = args.shift();
      var error = getError(logger, args);

      notify(logger, error);

    }.bind(this);
  };

  module.exports = LoggerAirbrakePlugin;
}());
