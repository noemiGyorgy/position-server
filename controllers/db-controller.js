const db = require("../database/queries");
let trackId = -1;

const initialize = () => {
  db.dropTable("position").then((isDropped) => {
    if (isDropped) {
      db.dropTable("track").then((isDropped) => {
        if (isDropped) {
          //createTrackTable().then(isCreated => {})
        }
      });
    }
  });
};

const savePosition = (position) => {
  if (trackId === -1) {
    db.insertTrack(position.start).then((id) => {
      trackId = id;
      db.insertPosition(position, trackId);
    });
  } else {
    db.insertPosition(position, trackId);
  }
};

module.exports = {
  initialize,
  savePosition,
};
