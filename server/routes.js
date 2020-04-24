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

/* ---- Test Quering MySQL database ---- */
function dishName() {
  var connection = getDBConnect()

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

/* ---- Real Queries ---- */
function getHighProtein(req, res) {
  var connection = getDBConnect();
  var inputRatio = req.params.proteinRatio;


  var query = `
  SELECT title
  FROM Recipe R
  WHERE R.protein/(R.calories + 1) >= '${inputRatio}'
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
  SELECT title
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
  SELECT title 
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
  SELECT title 
  FROM Recipe R
  WHERE R.calories < '${limit}'
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
//  var ingr1 = req.params.ingr1;
//  var ingr2 = req.params.ingr2;
//  var ingr3 = req.params.ingr3;
//  var ingr4 = req.params.ingr4;
//  var ingr5 = req.params.ingr5;

  var values = req.query;
  console.log(values);

  var whereClause = "";

  for (var key in values) {
    if (values.hasOwnProperty(key)) {
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

//      console.log(query);

//var query = `
//      SELECT name
//      FROM IngrPrices IP
//      WHERE IP.ingrID = '${ingr1}' OR IP.ingrID = '${ingr2}' OR IP.ingrID = '${ingr3}' OR IP.ingrID = '${ingr4}' OR IP.ingrID = '${ingr5}'
//  ;`;

//  var query = `
//      SELECT name
//      FROM IngrPrices IP
//      LIMIT 5
//  ;`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

  connection.end();
};

//AND IP.ingrID = '${ingr2}' AND IP.ingrID = '${ingr3}' AND IP.ingrID = '${ingr4}' AND IP.ingrID = '${ingr5}'
//   var query = `
//    WITH Available AS (
//        SELECT
//        FROM IngrPrices IP
//        WHERE IP.ingrID = '${ingr1}'
//    )
//    SELECT *
//    FROM Recipe R
//    WHERE NOT EXISTS (
//        SELECT *
//        FROM RIngredients RI RIGHT OUTER JOIN Available A ON RI.ingrID = A.ingrID
//        WHERE RI.rID = R.rID AND A.ingrID == NULL
//    )
//    ORDER BY R.rating
//    LIMIT 100;`;
//
//var query = `
//WITH Available AS (
//	SELECT IP.ingrID
//    FROM IngrPrices IP
//    WHERE IP.ingrID = '${ingr1}' OR IP.ingrID = '${ingr2}' OR IP.ingrID = '${ingr3}' OR IP.ingrID = '${ingr4}' OR IP.ingrID = '${ingr5}'
//)
//SELECT title
//FROM Recipe R
//WHERE NOT EXISTS (
//	SELECT *
//	FROM RIngredients RI LEFT OUTER JOIN Available A ON RI.ingrID = A.ingrID
//	WHERE RI.rID = R.rID AND A.ingrID IS NULL
//)
//ORDER BY R.rating
//LIMIT 100
//`;




// The exported functions, which can be accessed in index.js.
module.exports = {
  dishName: dishName,
  getLowSodium: getLowSodium,
  getHighFat: getHighFat,
  getHighProtein: getHighProtein,
  getLowCal: getLowCal,
  getValRecipes: getValRecipes
}