'use strict';
var should = require('should');
var sinon = require('sinon')
var SusiClient = require('../');

describe('susi-client-js node module', function () {
  it('must have full api support for SUSI', function () {
    var onsuccess = sinon.spy();
    var onerror   = sinon.spy();

    var address = 'ws://foo/';
    var Susi = new SusiClient(
      address, onsuccess, onerror
    );

    Susi.should.be.an.instanceOf(SusiClient)

    // onsuccess.called.should.be.exactly(true);
    // onerror.called.should.be.exactly(false);

    // Susi.should.have.property('ws')
    //   .which.is.exactly(address);
    Susi.should.have.property('registerConsumer')
      .which.is.a.Function;
    Susi.should.have.property('publish')
      .which.is.a.Function;

    // SusiClient
    // registerConsumer
    // publish
  });
});
