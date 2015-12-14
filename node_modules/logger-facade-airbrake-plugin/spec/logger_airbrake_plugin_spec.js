describe('Logger Airbrake Plugin', function(){

  var LoggerAirbrakePlugin = require('../index'),
      Airbrake = require('airbrake');

  var plugin, airbrakeSpy;


  beforeEach(function(){
    airbrakeSpy = jasmine.createSpyObj('airbrake', ['notify', 'handleExceptions']);
    spyOn(Airbrake, 'createClient').andReturn(airbrakeSpy);

    plugin = new LoggerAirbrakePlugin();
  });

  describe('#ctor', function(){

    describe('without configuration', function(){

      it('returns object with default config when null', function(){
        plugin = new LoggerAirbrakePlugin(null);
        expect(plugin.config).toEqual({
          apiKey: null,
          host: null,
          port: 80,
          protocol: 'http',
          notifyUncaughtException: false,
          developmentEnvironments: ['development', 'test'],
          appVersion: null
        });
      });

      it('returns object with default config when empty hash', function(){
        plugin = new LoggerAirbrakePlugin({});
        expect(plugin.config).toEqual({
          apiKey: null,
          host: null,
          port: 80,
          protocol: 'http',
          notifyUncaughtException: false,
          developmentEnvironments: ['development', 'test'],
          appVersion: null
        });
      });

    });

    describe('with configuration', function(){

      it('returns object with partial default config when partial hash', function(){
        plugin = new LoggerAirbrakePlugin({ apiKey: 'key' });
        expect(plugin.config).toEqual({
          apiKey: 'key',
          host: null,
          port: 80,
          protocol: 'http',
          notifyUncaughtException: false,
          developmentEnvironments: ['development', 'test'],
          appVersion: null
        });
      });

      it('returns object with config', function(){
        var config = {
          apiKey: 'key',
          host: 'host',
          port: 443,
          secure: true,
          notifyUncaughtException: true
        };
        plugin = new LoggerAirbrakePlugin(config);
        expect(plugin.config).toEqual(config);
      });

    });

    describe('configure airbrake client', function(){

      it('creates a airbrake client', function(){
        plugin = new LoggerAirbrakePlugin({ apiKey: 'key' });
        expect(Airbrake.createClient).toHaveBeenCalledWith('key');
      });

      describe('notifyUncaughtException', function(){

        it('does not catch uncaught exception', function(){
          plugin = new LoggerAirbrakePlugin({ apiKey: 'key'});
          expect(airbrakeSpy.handleExceptions.callCount).toEqual(0);
        });

        it('catch uncaught exception when configured', function(){
          plugin = new LoggerAirbrakePlugin({ apiKey: 'key', notifyUncaughtException: true });
          expect(airbrakeSpy.handleExceptions).toHaveBeenCalled();
        });

      });

    });

  });

  describe('#isDebug',function(){

    it('returns false ',function(){
      expect(plugin.isDebug()).toEqual(false);
    });

  });

  ['trace','debug','info','warn'].forEach(function(level){

    describe('logging in' + level, function(){

      it("doesn't notify", function(){
        plugin[level]("message");
        expect(airbrakeSpy.notify.callCount).toEqual(0);
      });

    });

  });

  describe('logging in error', function(){

    it("notify with error", function(){
      var e = new Error("message");
      plugin.error("logger name", e);
      expect(airbrakeSpy.notify).toHaveBeenCalledWith(e);
    });

    it("notify with error message", function(){
      plugin.error("logger name", "message");
      expect(airbrakeSpy.notify).toHaveBeenCalledWith(jasmine.any(Error));
    });

  });

});
