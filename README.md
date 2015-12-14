# CJ Broker

This project's purpose is to configure the broker with CJ-specific configurations for logging and endpoints.
It uses the [broker node implementation](https://github.com/pjanuario/zmq-service-suite-broker-js).


## If you find an issue
* Bugs related with configurations [here](https://github.com/Clubjudge/broker/issues).
* Bugs related with implementation [here](https://github.com/pjanuario/zmq-service-suite-broker-js/issues).

## Configuration

It uses the [convict](https://www.npmjs.org/package/convict) package to manage configurations.
The environment specific files should be added as ```config/env-name.json```. So for a development configuration the file would be created in ```config/development.json```.

## Running the Broker binary
    $ npm install
    $ bin/zss-broker


## Deployments

### Tag environment prefix
    * Integration: unstable_10.x.x
    * Staging:     testing_20.x.x
    * Production:  stable_30.x.x

### Deploy to staging environment

1. get last tag testing_ with: git tag command
2. set next version tag with: git tag testing_0.0.0
3. push tags with: git push --tag
4. update package on environment (check sysadmin deploy info)

### Deploy to integration environment
    # update local machine repository with last versions
    $ sudo apt-get update

    # check package version
    $ sudo apt-cache show brokerjs

    # install new package
    $ sudo apt-get install brokerjs
