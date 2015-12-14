[![Build Status](https://travis-ci.org/pjanuario/zmq-service-suite-message-js.svg?branch=master)](https://travis-ci.org/pjanuario/zmq-service-suite-message-js)
[![Code Climate](https://codeclimate.com/github/pjanuario/zmq-service-suite-message-js.png)](https://codeclimate.com/github/pjanuario/zmq-service-suite-message-js)
[![Coverage](http://img.shields.io/codeclimate/coverage/github/pjanuario/zmq-service-suite-message-js.svg)](https://codeclimate.com/github/pjanuario/zmq-service-suite-message-js)
[![Dependency Status](https://gemnasium.com/pjanuario/zmq-service-suite-message-js.svg)](https://gemnasium.com/pjanuario/zmq-service-suite-message-js)
![Grunt](https://cdn.gruntjs.com/builtwith.png)

# ZMQ Service Oriented Suite

This project aims to build a set of libraries and components usefulls to build decoupled and reliable service oriented architectures using Zero MQ. The implementation is inspired by Paranoid Pirate Pattern and Majordomo Patterns and also some of the descriptions are transcripted from ZeroMQ guide.

**The protocol goals of are:**

* Allow requests to be routed to workers on the basis of abstract service names;
* Allow both peers to detect disconnection of the other peer, through the use of heartbeating;
* Allow the broker to implement several patterns for task distribution to workers for a given service, such as round-robin, last recently used, etc..;
* Allow the broker to recover from dead or disconnected workers;
* Allow add/remove more workers when needed.

**The overall solution goals are:**
* Allow scale out, adding more nodes and clusters into the architecture would be painless;
* Minimize single point of failure, adding more than one broker with load balancing;

Using a brokerless architecture removes the single point of failures but also adds extra complexity.
So this is an hybrid approach that will avoid unnecessary complexity.
This [article](http://zeromq.org/whitepapers:brokerless) contains some useful information about brokerless architectures with pros/const and usefull patterns such as directory service and dynamic discovering.


**The overall topology contains:**
* Broker
* Service
* Client

![diagram](https://cloud.githubusercontent.com/assets/477458/3318005/f21ff090-f712-11e3-85ae-44423e0be998.png)

The protocol connects a set of client applications, a single/set of broker device/s and a pool of worker applications. Clients and workers connect to broker and both come and go arbitrarily. The broker open two sockets, one front-end for clients and one back-end for workers.
We define 'client' applications as those issuing requests, and 'worker' applications as those processing them.

The protocol makes these assumptions:
* Workers are idempotent, i.e. it is safe to execute the same request more than once.
* Workers will handle at most one request a time, and will issue exactly one reply for each successful request.
* The handles a set of shared request queues, one per service. Each queue has multiple writers (clients) and multiple readers (workers). The broker SHOULD serve clients on a fair basis and MAY deliver requests to workers on any basis, including round robin and least-recently used;
* The worker socket will connect to single broker.

##Protocol Message

The protocol message format is the same for all workflows.

* Frame 0: Client/Worker identity in according to RFC4122 v1 (timestamp-based) UUID, this used for reply routing, for more information check 0MQ router routing info;
* Frame 1: Indentify the protocol version;
* Frame 2: Message type, the message type can be REQ or REP;
* Frame 3: Request unique identifier in according to RFC4122 v1 (timestamp-based) UUID;
* Frame 4: Service address information for routing composed by service identifier and verb to execute;
* Frame 5: Header, this key value dictionary encoded in message pack. It could be used for other information such as: server response times, tokens;
* Frame 6: Status, this is the response status codes;
* Frame 7: Payload, this where the actual data is going, this is encode in message pack.

The current broker, client, workers implementation will use http status codes for responses. The errors information will be on payload with correct status code filled in.
The service name and verb are not case sensitive.

Future extension points:
* Add message type partial to execute request and responses with more than a single message. This will be usefull to execute use cases such as streaming and upload of large amounts of information.
* The Address information should be improved with service version, to target specific versions. The wildcard '*' should select the must recent version.
* reject potential duplicated requests to handle potential non-idempontent executions;
* implement titanic pattern for disconnected reliability, with service execution and response persistence.


## Broker

The broker will act only as addressing system receiving and routing request by service name. It implements an internal service managent interface service (SMI) that is reponsible for service instance management, adding and removing services from the cluster.
The broker MUST use a ROUTER socket to accept requests from clients, and workers. The broker MAY use a separate socket for each of them or a separated one for each.

## Client

The client workflow is fairly simple, it will send message one or more request messages to broker and wait for replies.

In the next dialog the 'C' represents the client and 'B' represents the Broker.

Single request reply

```
Repeat
  C: Request
  B: Reply
```

Multiple requests/replies

```
Repeat
  C: Request
  C: Request
  B: Reply
  B: Reply
```

##Worker

The worker workflows are a mix of a synchronous request-reply dialogs, initiated by the service worker, and an asynchronous heartbeat dialog that operates independently in both directions. This is the synchronous dialog where 'S' represents the worker and 'B' the broker.

The service execute registration accepting requests:

```
Once
  S: Request to Service Management Interface (SMI) with verb UP
  B: Forward to SMI
  SMI: Reply with status 200
```

Handles requests:

```
Repeat
  B: Request
  S: Reply
```

Disconnect worker:

```
Once
  S: Request to SMI with verb DOWN
  B: Forward to SMI
  SMI: Reply with status 200
```

The asynchronous heartbeat dialog operates on the same sockets and works thus:

```
Repeat (every second):
  S: Request to SMI with verb HEARTBEAT
  B: Forward to SMI
  SMI: Reply with status 200
```
