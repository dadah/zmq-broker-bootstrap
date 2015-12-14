[![Build Status](https://travis-ci.org/pjanuario/logger-facade-airbrake-plugin-nodejs.svg?branch=master)](https://travis-ci.org/pjanuario/logger-facade-airbrake-plugin-nodejs)
[![Code Climate](https://codeclimate.com/github/pjanuario/logger-facade-airbrake-plugin-nodejs.png)](https://codeclimate.com/github/pjanuario/logger-facade-airbrake-plugin-nodejs)
[![Coverage](http://img.shields.io/codeclimate/coverage/github/pjanuario/logger-facade-airbrake-plugin-nodejs.svg)](https://codeclimate.com/github/pjanuario/logger-facade-airbrake-plugin-nodejs)
[![Dependency Status](https://gemnasium.com/pjanuario/logger-facade-airbrake-plugin-nodejs.svg)](https://gemnasium.com/pjanuario/logger-facade-airbrake-plugin-nodejs)
![Grunt](https://cdn.gruntjs.com/builtwith.png)

# Logger Facade Airbrake plugin for Nodejs

[![version](https://badge.fury.io/js/logger-facade-airbrake-plugin.svg)](https://www.npmjs.org/package/logger-facade-airbrake-plugin)


Simple node module to log errors on [Airbrake](https://airbrake.io/) using logger facade.

This simple logger facade allows pluggin hook to execute different logging.

# How to use it

Install it:

```
npm install logger-facade-nodejs
npm install logger-facade-airbrake-plugin
```

Set up plugins and log errors

```javascript
var Logger = require('logger-facade-nodejs');
var LoggerAirbrakePlugin = require('logger-facade-airbrake-plugin');

console.log("Start sample of Async error Log...");

var config = {
  //api key, default (null)
  apiKey: "apikey",
  // host, default (null)
  host: "api.airbrake.io",
  // port, default (80)
  port: 80,
  // protocol, default (http)
  protocol: 'http',
  // notify uncaught excpetions, default (false)
  notifyUncaughtException: false,
  // dev envs, default (['development', 'test'])
  developmentEnvironments: ['development', 'test'],
  // appVersion, default (null)
  appVersion: null
};

var plugin = new LoggerAirbrakePlugin(config);
Logger.use(plugin);

console.log("Plugins: ", Logger.plugins());

var log = Logger.getLogger("Name");
log.error("Message to log %s", 'with args');

console.log("End sample...");
```

Download the code from this [gist](https://gist.github.com/pjanuario/713e7f46112f77adca5e).

## Contribution

Bug fixes and new features are of course very welcome!

To get started developing:
 - Install [Grunt](http://gruntjs.com/)
 - Install dependencies with ```npm install```
 - Run the test suite with ```npm test```

Please accompany any Pull Requests with the relevant test cases and make sure everything else still passes :).

### Contribution Flow

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

### Bump versioning

We use [grunt bump package](https://www.npmjs.org/package/grunt-bump) to control package versioning.

Bump Patch version

    $ grunt bump

Bump Minor version

    $ grunt bump:minor

Bump Major version

    $ grunt bump:major

### Running Specs

    $ npm test

### Coverage Report

We aim for 100% coverage and we hope it keeps that way! :)
We use pre-commit and pre-push hooks and CI to accomplish this, so don't mess with our build! :P

Check the report after running npm test.

    $ open ./coverage/lcov-report/index.html

# Credits
Shout out to @pjanuario.
