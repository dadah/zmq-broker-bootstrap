describe('Logger Console Plugin', function(){

  var LoggerConsolePlugin = require('../index'),
      moment = require('moment'),
      util = require('util');

  var plugin, defaultMessage;

  beforeEach(function(){
    plugin = new LoggerConsolePlugin();
    spyOn(moment, 'utc').andCallFake(function(){
      return moment("20140627 01:02:03", "YYYYMMDD HH:mm:ss");
    });
    spyOn(console, 'log').andReturn(Function.apply());
    spyOn(process, 'pid').andReturn(100);

    defaultMessage = '2014-06-27 01:02:03 | NAME::%s | PID: 100 - ';

  });

  describe('#ctor', function(){

    describe('without configuration', function(){

      it('returns object with default config when null', function(){
        plugin = new LoggerConsolePlugin(null);
        expect(plugin.config).toEqual({
          level: 'debug',
          timeFormat: 'YYYY-MM-DD HH:mm:ss',
          messageFormat: '%time | %logger::%level | PID: %pid - %msg'
        });
      });

      it('returns object with default config when empty hash', function(){
        plugin = new LoggerConsolePlugin({});
        expect(plugin.config).toEqual({
          level: 'debug',
          timeFormat: 'YYYY-MM-DD HH:mm:ss',
          messageFormat: '%time | %logger::%level | PID: %pid - %msg'
        });
      });

    });

    describe('with configuration', function(){

      it('returns object with partial default config when partial hash', function(){
        plugin = new LoggerConsolePlugin({ level: 'info' });
        expect(plugin.config).toEqual({
          level: 'info',
          timeFormat: 'YYYY-MM-DD HH:mm:ss',
          messageFormat: '%time | %logger::%level | PID: %pid - %msg'
        });
      });

      it('returns object with config', function(){
        var config = {
          level: 'error',
          timeFormat: 'moment format',
          messageFormat: 'message format'
        };
        plugin = new LoggerConsolePlugin(config);
        expect(plugin.config).toEqual(config);
      });

    });

  });

  describe('#level', function(){

    it('returns level property', function() {
      expect(plugin.level).toEqual('debug');
    });

    it('sets level property', function() {
      plugin.level = 'info';
      expect(plugin.level).toEqual('info');
    });

    it('does not do log on invalid level', function(){
      plugin.level = 'wtf';
      plugin.debug('name', "LOG MESSAGE");
      expect(console.log).not.toHaveBeenCalled();
    });

  });

  describe('#trace', function(){

    beforeEach(function(){
      plugin.level = 'trace';
      defaultMessage = util.format(defaultMessage, 'TRACE');
    });

    it('does not output when level is higher', function(){
      plugin.level = 'error';
      plugin.trace('name', "LOG MESSAGE");
      expect(console.log).not.toHaveBeenCalled();
    });

    it('outputs log into console.log', function(){
      plugin.trace('name', "LOG MESSAGE");
      expect(console.log).toHaveBeenCalledWith(defaultMessage + "LOG MESSAGE");
    });

    it('outputs error into console.log', function(){
      var error = new Error("error");
      error.stack = "stack";
      plugin.trace('name', error);
      expect(console.log).toHaveBeenCalledWith(defaultMessage + error.stack);
    });

    it('outputs log into console.log with args', function(){
      plugin.trace('name', "LOG MESSAGE %s", 1);
      expect(console.log).toHaveBeenCalledWith(defaultMessage + "LOG MESSAGE %s", 1);
    });

  });

  describe('#debug', function(){

    beforeEach(function(){
      plugin.level = 'debug';
      defaultMessage = util.format(defaultMessage, 'DEBUG');
    });

    it('does not output when level is higher', function(){
      plugin.level = 'error';
      plugin.debug('name', "LOG MESSAGE");
      expect(console.log).not.toHaveBeenCalled();
    });

    it('outputs log into console.log', function(){
      plugin.debug('name', "LOG MESSAGE");
      expect(console.log).toHaveBeenCalledWith(defaultMessage + "LOG MESSAGE");
    });

    it('outputs error into console.log', function(){
      var error = new Error("error");
      error.stack = "stack";
      plugin.debug('name', error);
      expect(console.log).toHaveBeenCalledWith(defaultMessage + error.stack);
    });

    it('outputs log into console.log with args', function(){
      plugin.debug('name', "LOG MESSAGE %s", 1);
      expect(console.log).toHaveBeenCalledWith(defaultMessage + "LOG MESSAGE %s", 1);
    });

  });

  describe('#info', function(){

    beforeEach(function(){
      plugin.level = 'info';
      defaultMessage = util.format(defaultMessage, 'INFO');
    });

    it('does not output when level is higher', function(){
      plugin.level = 'error';
      plugin.info('name', "LOG MESSAGE");
      expect(console.log).not.toHaveBeenCalled();
    });

    it('outputs log into console.log', function(){
      plugin.info('name', "LOG MESSAGE");
      expect(console.log).toHaveBeenCalledWith(defaultMessage + "LOG MESSAGE");
    });

    it('outputs error into console.log', function(){
      var error = new Error("error");
      error.stack = "stack";
      plugin.info('name', error);
      expect(console.log).toHaveBeenCalledWith(defaultMessage + error.stack);
    });

    it('outputs log into console.log with args', function(){
      plugin.info('name', "LOG MESSAGE %s", 1);
      expect(console.log).toHaveBeenCalledWith(defaultMessage + "LOG MESSAGE %s", 1);
    });

  });

  describe('#warn', function(){

    beforeEach(function(){
      plugin.level = 'warn';
      defaultMessage = util.format(defaultMessage, 'WARN');
    });

    it('does not output when level is higher', function(){
      plugin.level = 'error';
      plugin.warn('name', "LOG MESSAGE");
      expect(console.log).not.toHaveBeenCalled();
    });

    it('outputs log into console.log', function(){
      plugin.warn('name', "LOG MESSAGE");
      expect(console.log).toHaveBeenCalledWith(defaultMessage + "LOG MESSAGE");
    });

    it('outputs error into console.log', function(){
      var error = new Error("error");
      error.stack = "stack";
      plugin.warn('name', error);
      expect(console.log).toHaveBeenCalledWith(defaultMessage + error.stack);
    });

    it('outputs log into console.log with args', function(){
      plugin.warn('name', "LOG MESSAGE %s", 1);
      expect(console.log).toHaveBeenCalledWith(defaultMessage + "LOG MESSAGE %s", 1);
    });

  });

  describe('#error', function(){

    beforeEach(function(){
      plugin.level = 'error';
      defaultMessage = util.format(defaultMessage, 'ERROR');
    });

    it('outputs log into console.log', function(){
      plugin.error('name', "LOG MESSAGE");
      expect(console.log).toHaveBeenCalledWith(defaultMessage + "LOG MESSAGE");
    });

    it('outputs error into console.log', function(){
      var error = new Error("error");
      error.stack = "stack";
      plugin.error('name', error);
      expect(console.log).toHaveBeenCalledWith(defaultMessage + error.stack);
    });

    it('outputs log into console.log with args', function(){
      plugin.error('name', "LOG MESSAGE %s", 1);
      expect(console.log).toHaveBeenCalledWith(defaultMessage + "LOG MESSAGE %s", 1);
    });

  });

  describe('#isDebug',function(){

    it('returns true when level in trace',function() {
      plugin.level = 'trace';
      expect(plugin.isDebug()).toEqual(true);
    });

    it('returns true when level in debug',function() {
      plugin.level = 'debug';
      expect(plugin.isDebug()).toEqual(true);
    });

    it('returns false when level not in trace or debug',function(){
      plugin.level = 'info';
      expect(plugin.isDebug()).toEqual(false);
    });

  });

});
