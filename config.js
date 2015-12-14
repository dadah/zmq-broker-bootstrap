(function() {
  var convict = require('convict');

  var config = module.exports = convict({
    env: {
      doc: "The application environment.",
      format: ["production", "development", "test", "staging"],
      default: "development",
      env: "NODE_ENV",
      arg: "node-env",
    },
    debug: {
      doc: "The application's debug level",
      format: [0, 1, 2],
      default: 2,
      env: "NODE_DEBUG",
      arg: "node-debug"
    },
    broker: {
      backend: {
        doc: "The backend endpoint on broker",
        default: "tcp://127.0.0.1:7776"
      },
      frontend: {
        doc: "The frontend endpoint on broker",
        default: "tcp://127.0.0.1:7777"
      },
      smi: {
        heartbeat: {
          doc: "The Service Management Interface heartbeat interval (ms)",
          default: 1000
        },
        maxTTL: {
          doc: "The Service Management Interface max TTL for a service (ms)",
          default: 2000
        },
        updateInterval: {
          doc: "The Service Management Interface refresh interval (ms)",
          default: 500
        }
      }
    },
    log: {
      consolePlugin: {
        level: {
          doc: "The Console log pluggin level",
          default: 'info'
        },
        timeFormat: {
          doc: "The Console log pluggin timeFormat",
          default: 'YYYY-MM-DD HH:mm:ss'
        },
        messageFormat: {
          doc: "The Console log pluggin messageFormat",
          default: '%time | %level | %logger - %msg'
        }
      }
    }
  });

  var path = process.env.ZSS_CONFIG;
  var env = config.get('env');
  config.loadFile(path + '/' + env + '.json');
}());
