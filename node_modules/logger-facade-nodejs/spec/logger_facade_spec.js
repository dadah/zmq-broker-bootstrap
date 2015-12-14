describe('Logger', function() {

  var Logger = require('../index');

  var plugin;

  beforeEach(function(){
    Logger.clearPlugins();
    plugin = {
      name: 'mock',
      isDebug: Function.apply(),
      trace: Function.apply(),
      debug: Function.apply(),
      info: Function.apply(),
      warn: Function.apply(),
      error: Function.apply()
    };
  });

  afterEach(function(){
    Logger.clearPlugins();
  });

  describe('.getLogger', function(){
    it('returns a logger instance', function(){
      expect(Logger.getLogger(null)).not.toBeNull();
    });
  });

  describe('.use', function() {

    it('register a plugin', function(done){
      plugin.debug = function(logger, message, otherArg) {
        expect(logger).toEqual('test logger');
        expect(message).toEqual("message");
        expect(otherArg).toEqual("other param");
        done();
      };

      Logger.use(plugin);

      var log = Logger.getLogger('test logger');
      log.debug("message","other param");
    });

    it('does not register null plugin', function(){
      Logger.use(null);
      expect(Logger.plugins()).toEqual([]);
    });

    it('does not register a plugin without plugin interface', function(){
      Logger.use({});
      expect(Logger.plugins()).toEqual([]);
    });

  });

  describe('.plugins', function() {

    it('returns registered plugins name', function() {
      plugin.name = 'test plugin';
      Logger.use(plugin);
      expect(Logger.plugins()).toEqual(['test plugin']);
    });

  });

  describe('.clearPlugins', function() {

    it('removes all registered plugins', function(){
      Logger.use({ name: 'test plugin' });
      Logger.clearPlugins();
      expect(Logger.plugins()).toEqual([]);
    });

  });

  describe('#isDebug', function(){

    describe('when exists a plugin configured in debug levels', function(){

      it('returns true', function(){
        var otherPlugin = {
          name: 'mock',
          isDebug: function(){ return true; },
          trace: Function.apply(),
          debug: Function.apply(),
          info: Function.apply(),
          warn: Function.apply(),
          error: Function.apply()
        };
        plugin.isDebug = function(){ return false; };
        Logger.use(otherPlugin);
        Logger.use(plugin);

        var log = Logger.getLogger();
        expect(log.isDebug()).toEqual(true);
      });

    });

    describe('when does not exists a plugin configured in debug levels', function(){

      it('returns false', function(){
        var otherPlugin = {
          name: 'mock',
          isDebug: function(){ return false; },
          trace: Function.apply(),
          debug: Function.apply(),
          info: Function.apply(),
          warn: Function.apply(),
          error: Function.apply()
        };
        plugin.isDebug = function(){ return false; };
        Logger.use(otherPlugin);
        Logger.use(plugin);

        var log = Logger.getLogger();
        expect(log.isDebug()).toEqual(false);
      });

    });

    describe('when does not exists plugins', function(){

      it('returns false', function(){
        var log = Logger.getLogger();
        expect(log.isDebug()).toEqual(false);
      });

    });

  });

  describe('#trace', function(){

    it('calls plugin in trace level', function(done){

      plugin.trace = function(logger, message, otherArg) {
        expect(logger).toEqual('test logger');
        expect(message).toEqual("message");
        expect(otherArg).toEqual("other param");
        done();
      };

      Logger.use(plugin);

      var log = Logger.getLogger('test logger');
      log.trace("message","other param");
    });

  });

  describe('#debug', function(){

    it('calls plugin in debug level', function(done){

      plugin.debug = function(logger, message, otherArg) {
        expect(logger).toEqual('test logger');
        expect(message).toEqual("message");
        expect(otherArg).toEqual("other param");
        done();
      };

      Logger.use(plugin);

      var log = Logger.getLogger('test logger');
      log.debug("message","other param");
    });

  });

  describe('#info', function(){

    it('calls plugin in info level', function(done){

      plugin.info = function(logger, message, otherArg) {
        expect(logger).toEqual('test logger');
        expect(message).toEqual("message");
        expect(otherArg).toEqual("other param");
        done();
      };

      Logger.use(plugin);

      var log = Logger.getLogger('test logger');
      log.info("message","other param");
    });

  });

  describe('#warn', function(){

    it('calls plugin in warn level', function(done){

      plugin.warn = function(logger, message, otherArg) {
        expect(logger).toEqual('test logger');
        expect(message).toEqual("message");
        expect(otherArg).toEqual("other param");
        done();
      };

      Logger.use(plugin);

      var log = Logger.getLogger('test logger');
      log.warn("message","other param");
    });

  });

  describe('#error', function(){

    it('calls plugin in error level', function(done){

      plugin.error = function(logger, message, otherArg) {
        expect(logger).toEqual('test logger');
        expect(message).toEqual("message");
        expect(otherArg).toEqual("other param");
        done();
      };

      Logger.use(plugin);

      var log = Logger.getLogger('test logger');
      log.error("message","other param");
    });

  });

});
