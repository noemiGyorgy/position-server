const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "boatdb",
  password: "password",
  port: 5432,
});

const savePosition = (position) => {
  pool.query(
    "INSERT INTO track (position) VALUES ($1)",
    [position],
    (error, results) => {
      if (error) {
        console.log(error);
      }
      console.log(`Position added with ID: ${results.insertId}`);
    }
  );
};

module.exports = {
  savePosition,
};
