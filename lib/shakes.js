EventEmitter = require("events").EventEmitter
geolib = require("geolib");

const TIMEOUT = 5000;

class Shakes extends EventEmitter {
  constructor() {
    super();
    this._index = 0;
    this._list = {};
  }

  /**
   * @method push
   * @param {SocketIO.Client} client The client connection of this opponent
   * @param {Object} data Data received from the client including `longitude` and `latitude`
   */
  push(client, data) {
    let time     = new Date();
    let item     = { client, data, time };
    let opponent = this._popOpponent(item);
    if (opponent) {
      return this.emit('match', item, opponent);
    } else {
      let index = this._index++;
      this._list[index] = item;
      setTimeout(() => {
        delete this._list[index];
      }, TIMEOUT);
    }
  }

  /**
   * Removes all items associated with the given client connection
   *
   * @method removeClient
   * @param {SocketIO.Client} client Client connection to remove all data for
   */
  removeClient(client) {
    Object.keys(this._list).forEach((key) => {
      let item = this._list[key];
      if (!item) {
        return;
      }
      if (item.client === client) {
        delete this._list[key];
      }
    });
  }

  /**
   * It is looking for the best matching opponent removes it of the opponents
   * list and returns it.
   *
   * @private
   * @method _popOpponent
   * @return {Object|null} The best matching opponent or null if no match is found
   */
  _popOpponent(item) {
    let opponent = {
      candidate: null,
      distance: 150,
      key: null
    };

    Object.keys(this._list).forEach((key) => {
      let candidate = this._list[key];
      if (!candidate) {
        return;
      }
      let distance  = geolib.getDistance(item.data, candidate.data);
      let offset    = Math.abs(item.time - candidate.time);
      if (offset < 5000 && distance < opponent.distance) {
        opponent = { candidate, distance, key };
      }
    });

    if (opponent.candidate) {
      delete this._list[opponent.key];
    }

    return opponent.candidate;
  }
}

module.exports = Shakes;
