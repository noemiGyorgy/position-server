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

const insertTrack = (start) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO track (start, islive) VALUES ($1, $2) RETURNING id",
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

module.exports = {
  insertTrack,
  insertPosition,
  dropTable,
};
