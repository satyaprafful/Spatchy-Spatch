var mysql = require('mysql');

/*  put this in a function bc right now being janky and connecting
  * to the DB before each query and ending the connection after.
  * Should figure out better way, instead, to close connections.
  */
function getDBConnect()
{
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

  return connection;
}

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */
function getHighProtein(req, res) {
  var connection = getDBConnect();
  var inputRatio = req.params.proteinRatio;


  var query = `
  SELECT *
  FROM Recipe R
  WHERE R.protein/(R.calories + 1) >= '${inputRatio}' AND R.protein >= 5
  ORDER BY R.rating
  LIMIT 10`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
  
  connection.end();
};

function getHighFat(req, res) {
  var connection = getDBConnect();
  var inputRatio = req.params.fatRatio;

  var query = `
  SELECT *
  FROM Recipe R
  WHERE R.fat/(R.calories + 1) >= '${inputRatio}'
  ORDER BY R.rating
  LIMIT 10`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
  
  connection.end();
};

function getLowSodium(req, res) {
  var connection = getDBConnect();
  var limit = req.params.sodiumLimit;

  var query = `
  SELECT * 
  FROM Recipe R
  WHERE R.sodium < '${limit}'
  ORDER BY R.rating
  LIMIT 10`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
  
  connection.end();
};

function getLowCal(req, res) {
  var connection = getDBConnect();
  var limit = req.params.calLimit;

  var query = `
  SELECT * 
  FROM Recipe R
  WHERE R.calories < '${limit}' AND R.calories > 100
  ORDER BY R.rating
  LIMIT 10`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
  
  connection.end();
};

function getValRecipes(req, res) {
  var connection = getDBConnect();
  var values = req.query;

  var whereClause = "";

  for (var key in values) {
    if (values.hasOwnProperty(key)) 
    {
        console.log(key, values[key]);
        whereClause += "IP.ingrID = " + values[key] + " OR ";
    }
  }
  if (whereClause.substring(whereClause.length - 4) == " OR ") {
        whereClause = whereClause.substring(0, whereClause.length - 4);
  }
  var query = `
  SELECT name
  FROM IngrPrices IP
  WHERE ${whereClause}
  ;`;

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
  getLowSodium: getLowSodium,
  getHighFat: getHighFat,
  getHighProtein: getHighProtein,
  getLowCal: getLowCal,
  getValRecipes: getValRecipes
}