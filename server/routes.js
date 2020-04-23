var mysql = require('mysql');

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* ---- Test Quering MySQL database ---- */
function dishName(req, res) {
  var connection = mysql.createConnection({
    host     : 'database2.calom4x7svhj.us-east-1.rds.amazonaws.com',
    user     : 'admin',
    password : 'admin123',
    port     : 3306,
    database : 'database2',
    insecureAuth : true
  });

  connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }

    console.log('Connected to database.');
  });

  var query = `
  SELECT *
  FROM Dish
  LIMIT 1;`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
  
  connection.end();

};

// The exported functions, which can be accessed in index.js.
module.exports = {
  dishName: dishName
}