(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Client = function (address, onsuccess, onerror) {
  this.consumers = {};
  this.publishCallbacks = {};
  try {
    this.ws = new WebSocket(address);
    var self = this;
    this.ws.onopen = function(){
      setInterval(function(){
        self.ws.send(JSON.stringify({
          type: "publish",
          data: {
            topic: "session::update"
          }
        }));
      },2000);

      onsuccess = onsuccess || function (ctx) { console.log(ctx); };
      onsuccess(self);
    };
    this.ws.onmessage = function(msg){
      self._handleIncome(msg);
    };
  } catch (e) {
    onerror = onerror || function (exception) { console.error(exception); };
    onerror(e);
  }
};


Client.prototype.registerConsumer = function(topic,cb) {
  var consumers = this.consumers[topic] || [];
  consumers.push(cb);
  if(consumers.length === 1){
    this.ws.send(JSON.stringify({
      type: "registerConsumer",
      data: {
        topic: topic
      }
    }));
  }
  this.consumers[topic] = consumers;
};

Client.prototype.publish = function(topic,payload,cb) {
  var id = ''+Date.now();
  this.publishCallbacks[id] = cb;
  this.ws.send(JSON.stringify({
    type: 'publish',
    data: {
      topic: topic,
      payload: payload,
      id: id
    },
  }));
};

Client.prototype._handleIncome = function(msg){
  var packet = JSON.parse(msg.data);
  if(packet.type === 'consumerEvent'){
    var consumers = this.consumers[packet.data.topic];
    for (var i = consumers.length - 1; i >= 0; i--) {
      consumers[i](packet.data);
    }
  }
  if (packet.type === 'ack'){
    if(packet.data.id && this.publishCallbacks[packet.data.id]){
      this.publishCallbacks[packet.data.id](packet.data);
      delete this.publishCallbacks[packet.data.id];
    }
  }
};

module.exports = Client;

},{}]},{},[1]);
