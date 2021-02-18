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

const savePosition = (position) => {
  pool.query(
    "INSERT INTO position (latitude, longitude, heading) VALUES ($1, $2, $3)",
    [position.lat, position.lon, position.heading],
    (error, results) => {
      if (error) {
        console.log(error);
      }
    }
  );
};

module.exports = {
  savePosition,
};
