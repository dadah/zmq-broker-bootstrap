(function() {

  var plugins = [];

  var LoggerInstance = function(name){

    this.isDebug = function(){

      var debug = false;

      plugins.forEach(function(plugin) {
        debug = plugin.isDebug() ? true : debug;
      });

      return debug;
    };

    var log = function(data, level){

      var args = Array.prototype.slice.call(data);
      // add logger name
      args.unshift(name);

      plugins.forEach(function(plugin) {

        var compute = function(){
          plugin[level].apply(plugin, args);
        };

        process.nextTick(compute);
      });
    };

    this.trace = function(){
      log(arguments, 'trace');
    };

    this.debug = function() {
      log(arguments, 'debug');
    };

    this.info = function(){
      log(arguments, 'info');
    };

    this.warn = function(){
      log(arguments, 'warn');
    };

    this.error = function(){
      log(arguments, 'error');
    };

  };

  var isValidPlugin = function(plugin){

    var isValid = plugin && plugin.name;
    isValid = isValid && (plugin.isDebug instanceof Function);
    isValid = isValid && (plugin.trace instanceof Function);
    isValid = isValid && (plugin.debug instanceof Function);
    isValid = isValid && (plugin.info instanceof Function);
    isValid = isValid && (plugin.warn instanceof Function);
    isValid = isValid && (plugin.error instanceof Function);

    return isValid;
  };

  var Logger = { };

  Logger.getLogger = function(name){
    return new LoggerInstance(name);
  };

  Logger.use = function(plugin) {

    if(isValidPlugin(plugin)){
      plugins.push(plugin);
    }
  };

  Logger.plugins = function() {

    return plugins.map(function(plugin){
      return plugin.name;
    });
  };

  Logger.clearPlugins = function() {

    plugins.splice(0, plugins.length);
  };

  module.exports = Logger;
}());
