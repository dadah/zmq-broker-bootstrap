(function() {

  var _ = require('lodash'),
      moment = require('moment');

  var LoggerConsolePlugin = function(configuration){
    var defaults = {
      level: 'debug',
      timeFormat: 'YYYY-MM-DD HH:mm:ss',
      messageFormat: '%time | %logger::%level | PID: %pid - %msg'
    };

    var config = _.defaults(configuration || {}, defaults);
    //moment.utc().format('YYYY-MM-DD HH:mm:ss')

    var levels = {
      trace: 0,
      debug: 1,
      info:  2,
      warn:  3,
      error: 4
    };

    var isLevelActive = function(logLevel){

      var activeLevel = levels[this.level.toLowerCase()];
      var level = levels[logLevel];
      return activeLevel <= level;

    }.bind(this);

    var getMessage = function(logger, level, msg){
      var now = moment.utc().format(this.config.timeFormat);

      var outputMsg = msg instanceof Error ? msg.stack : msg;

  		var formatedMessage = this.config.messageFormat
  			.replace('%logger', logger.toUpperCase())
  			.replace('%time', now)
  			.replace('%level', level.toUpperCase())
  			.replace('%pid', process.pid)
  			.replace('%msg', outputMsg);

      return formatedMessage;
    }.bind(this);

    var log = function(level, args){

      if(isLevelActive(level)) {
        args = _.toArray(args);

        var logger = args.shift();
        var msg = args.shift();

        var output = getMessage(logger, level, msg);

        args.unshift(output);

        console.log.apply(console, args);
      }

    }.bind(this);

    this.config = config;

    this.level = config.level;

    this.name = 'LoggerConsolePlugin';

    this.isDebug = function(){
      return isLevelActive('debug');
    }.bind(this);

    this.debug = function(){
      log('debug', arguments);
    }.bind(this);

    this.trace = function(){
      log('trace', arguments);
    }.bind(this);

    this.info = function(){
      log('info', arguments);
    }.bind(this);

    this.warn = function(){
      log('warn', arguments);
    }.bind(this);

    this.error = function(){
      log('error', arguments);
    }.bind(this);
  };

  module.exports = LoggerConsolePlugin;
}());
