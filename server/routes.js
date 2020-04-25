var mysql = require('mysql');
var Person = require('./models/person.js');
const mongoose = require('mongoose');

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

/* ---- Login Routes ---- */
function signupUser(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);
	var newPerson = new Person ({
		username: req.body.username,
		password: req.body.password,
    isVegan: req.body.isVegan,
    isVegetarian: req.body.isVegetarian,
    isLactose: req.body.isLactose,
    isNut: req.body.isNut,
    isGluten: req.body.isGluten,
    weight: req.body.weight,
    heightFeet: req.body.heightFeet,
    heightInches:  req.body.heightInches,
    activityLevel:  req.body.activityLevel,
    age:  req.body.age
	});
//   const schemas = [];
//   mongoose.modelNames().forEach(function(modelName){
//     schemas.push(mongoose.model(modelName).schema.obj);
//   })

// console.log(schemas);

	newPerson.save( (err) => {
		if (err) {
			res.type('html').status(200);
			res.write('uh oh: ' + err);
			console.log(err);
			res.end();
		}
		else {
      console.log("it worked");
      console.log(newPerson);
			res.json(newPerson);
		}
	});
  // Person.find({}, function(err, users){
  //   var userMap = {};

  //   users.forEach(function(user) {
  //     console.log(user);
  //   });
  // })
};

function loginUser(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	Person.findOne({username: username}, function(err, user){
		if (err) {
			res.type('html').status(200);
			res.write('uh oh: ' + err);
			console.log(err);
			res.end();
		}
		else {
      if(user.password !== password) {
        res.send(JSON.stringify({result: 'f'}));
      } else {
        console.log(user);
        res.send(JSON.stringify({result: 'p'}));
      }
		}
	});
};




// The exported functions, which can be accessed in index.js.
module.exports = {
  getLowSodium: getLowSodium,
  getHighFat: getHighFat,
  getHighProtein: getHighProtein,
  getLowCal: getLowCal,
  getValRecipes: getValRecipes,
  signupUser: signupUser,
  loginUser: loginUser
}