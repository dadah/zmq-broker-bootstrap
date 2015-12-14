(function() {
  var util = require('util'),
      msgpack = require('msgpack-js'),
      uuid = require('uuid'),
      PROTOCOL_VERSION = 'ZSS:0.0';

  var Message = function(sid, verb, sversion){
    var self = this;

    if (!sversion){
      sversion = '*';
    }

    self.identity = null;
    self.protocol = PROTOCOL_VERSION;
    self.type = Message.Type.REQ;
    self.rid = uuid.v1();
    self.address = {
      sid: sid,
      sversion: sversion,
      verb: verb
    };
    self.headers = null;
    self.status = null;
    self.payload = null;

    self.toString = function(){
      var message = "********\nFRAME 0: %s\nFRAME 1: %s\nFRAME 2: %s\nFRAME 3: %s\nFRAME 4: %j\nFRAME 5: %j\nFRAME 6: %s\nFRAME 7: %j\n********";
      return util.format(message, self.identity, self.protocol, self.type, self.rid, self.address, self.headers, self.status, self.payload);
    };

    self.toFrames = function(){
      return Message.toFrames(self);
    };
  };

  Message.Type = {
    REQ: "REQ",
    REP: "REP"
  };

  Message.parse = function(frames){
    var msg = new Message();

    if(frames.length === 7) {
      frames.unshift('');
    }

    var identity = String(frames[0]);
    var status = parseInt(frames[6], 10);
    
    msg.identity = identity === '' ? null : identity;
    msg.protocol = String(frames[1]);
    msg.type = String(frames[2]);
    msg.rid = String(frames[3]);
    msg.address = msgpack.decode(frames[4]);
    msg.headers = msgpack.decode(frames[5]);
    msg.status = status ? status : null;
    msg.payload = msgpack.decode(frames[7]);
    return msg;
  };

  Message.toFrames = function(msg){
    var frames = [
      msg.identity ? msg.identity : '',
      msg.protocol,
      msg.type,
      msg.rid,
      msgpack.encode(msg.address),
      msgpack.encode(msg.headers),
      msg.status,
      msgpack.encode(msg.payload)
    ];
    return frames;
  };

  module.exports = Message;
}());
