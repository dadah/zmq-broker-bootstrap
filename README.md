# CJ Broker

This project's purpose is to provide bootstrap configurations for logging and endpoints for use with [broker node implementation](https://github.com/pjanuario/zmq-service-suite-broker-js).

## Configuration

It uses the [convict](https://www.npmjs.org/package/convict) package to manage configurations.
The environment specific files should be added as ```config/env-name.json```. So for a development configuration the file would be created in ```config/development.json```.

## Running the Broker binary
    $ npm install
    $ bin/zss-broker
