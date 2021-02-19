const db = require("../database/queries");
let trackId = -1;

const initialize = () => {
  db.dropTable("position").then((isDropped) => {
    if (isDropped) {
      db.dropTable("track").then((isDropped) => {
        if (isDropped) {
          db.createTrackTable().then((isCreated) => {
            db.createPositionTable();
          });
        }
      });
    }
  });
};

const terminateLiveStreaming = () => {
  db.turnOffLive(trackId);
  trackId = -1;
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

const getTracks = () => {
  return new Promise((resolve, reject) => {
    db.getTracks().then((rows) => resolve(rows));
  });
};

module.exports = {
  initialize,
  savePosition,
  terminateLiveStreaming,
  getTracks,
};
