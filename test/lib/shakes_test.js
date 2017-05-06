const Shakes = require('../../lib/shakes.js');

describe('Shares', function() {
  let shakeList;

  beforeEach(function() {
    shakeList = new Shakes();
  });

  it('responds to #push', function() {
    expect(shakeList).to.respondTo('push');
  });

  it('responds to #removeClient', function() {
    expect(shakeList).to.respondTo('removeClient');
  });

  describe('#push', function() {
    it('adds the item if list is empty', function() {
      shakeList.push('client', { latitude: 0.0, longitude: 0.0 });
      expect(Object.keys(shakeList._list)).to.have.length(1);
    });

    it('adds the item if no matching opponent is available', function() {
      shakeList.push('client1', { latitude: 0.0, longitude: 0.0 });
      shakeList.push('client2', { latitude: 1.0, longitude: 1.0 });
      expect(Object.keys(shakeList._list)).to.have.length(2);
    });

    it('is not adding the item and removing opponent if matching opponent was found', function() {
      shakeList.push('client1', { latitude: 0.0, longitude: 0.0 });
      shakeList.push('client2', { latitude: 0.0001, longitude: 0.0 });
      expect(Object.keys(shakeList._list)).to.have.length(0);
    });

    it('is emitting an event if opponent was found', function() {
      let spy = sinon.spy();
      shakeList.on('match', spy);
      shakeList.push('client1', { latitude: 0.0, longitude: 0.0 });
      shakeList.push('client2', { latitude: 0.0001, longitude: 0.0 });
      expect(spy).to.have.been.calledWith(
        sinon.match.object, sinon.match.object
      );
    });
  });

  describe('#removeClient', function() {
    it('removes all shakes associated with the given client', function() {
      shakeList.push('client1', { latitude: 0.0, longitude: 0.0 });
      shakeList.push('client2', { latitude: 1.0, longitude: 1.0 });
      shakeList.removeClient('client1');
      expect(Object.keys(shakeList._list)).to.have.length(1);
    });
  });
});
