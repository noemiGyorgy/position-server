require("dotenv").config();
const Pool = require("pg").Pool;
const Client = require("pg").Client;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const dropTable = (table) => {
  return new Promise((resolve, reject) => {
    pool.query("DROP TABLE IF EXISTS " + table, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(true);
    });
  });
};

const createTrackTable = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE track (\
        id SERIAL NOT NULL CONSTRAINT track_pk PRIMARY KEY,\
        start  TIMESTAMP WITH TIME ZONE,\
        live BOOLEAN\
      );\
      CREATE INDEX track_start_index ON track (start desc);",
      (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(true);
      }
    );
  });
};

const createPositionTable = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE position (\
        id SERIAL NOT NULL CONSTRAINT position_pk PRIMARY KEY,\
        latitude  NUMERIC(10, 8),\
        longitude NUMERIC(11, 8),\
        heading   NUMERIC(12, 9),\
        track_id  INTEGER CONSTRAINT position_track_fk REFERENCES track)",
      (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(true);
      }
    );
  });
};

const insertTrack = (start) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO track (start, live) VALUES ($1, $2) RETURNING id",
      [new Date(start), true],
      (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(result.rows[0].id);
      }
    );
  });
};

const insertPosition = (position, trackId) => {
  pool.query(
    "INSERT INTO position (latitude, longitude, heading, track_id) VALUES ($1, $2, $3, $4)",
    [position.lat, position.lon, position.heading, trackId],
    (error, result) => {
      if (error) {
        console.log(error);
      }
    }
  );
};

const turnOffLive = (trackId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE track SET live = false WHERE id = ($1)",
      [trackId],
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          resolve(true);
        }
      }
    );
  });
};

const getTracks = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM track", (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      console.log(result.rows);
      resolve(result.rows);
    });
  });
};

module.exports = {
  insertTrack,
  insertPosition,
  dropTable,
  createTrackTable,
  createPositionTable,
  turnOffLive,
  getTracks,
};
