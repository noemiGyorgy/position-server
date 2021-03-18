const db = require("../database/queries");
let trackId = -1;

const getTrackId = () => {
  return trackId;
}

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
  return new Promise((resolve, reject) => {
    db.turnOffLive(trackId).then((success) => {
      trackId = -1;
      resolve(success);
    });
  });
};

const savePosition = (position, pause) => {
  if (trackId === -1) {
    db.insertTrack(position.start).then((id) => {
      trackId = id;
      db.insertPosition(position, pause, trackId);
    });
  } else {
    db.insertPosition(position, pause, trackId);
  }
};

const getTracks = () => {
  return new Promise((resolve, reject) => {
    db.getTracks().then((rows) => {
      let tracks = {};
      for (let index in rows) {
        tracks[rows[index].id] = {start: rows[index].start, live: rows[index].live}
      }
      resolve(tracks)});
  });
};

const getTrack = (id) => {
  return new Promise((resolve, reject) => {
    db.getTrack(id).then((rows) => resolve(rows));
  });
};

module.exports = {
  getTrackId,
  initialize,
  savePosition,
  terminateLiveStreaming,
  getTracks,
  getTrack,
};
