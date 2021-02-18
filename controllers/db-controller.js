const db = require("../database/queries");
let trackId = -1;

const savePosition = (position) => {
  if (trackId === -1) {
    promise = db.insertTrack(position.start);
    promise.then((id) => {
      trackId = id;
      db.insertPosition(position, trackId);
    });
  } else {
    db.insertPosition(position, trackId);
  }
};

module.exports = {
  savePosition,
};
