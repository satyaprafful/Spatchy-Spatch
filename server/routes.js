var mysql = require('mysql');
var Person = require('./models/person.js');
const mongoose = require('mongoose');
var session = require('express-session')


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
  ORDER BY R.rating DESC
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
  ORDER BY R.rating DESC
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
  ORDER BY R.rating DESC
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
  ORDER BY R.rating DESC
  LIMIT 10`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
  
  connection.end();
};


/* ---- Ingr Search Routes ---- */
function getValRecipes(req, res) {
  var connection = getDBConnect();
  var values = req.query;

  var whereClause = "";

  for (var key in values) {
    if (values.hasOwnProperty(key)) {
        if (values.hasOwnProperty(key))
        {
            whereClause += "IP.ingrID = " + values[key] + " OR ";
        }
    }
  }

  if (whereClause.substring(whereClause.length - 4) == " OR ") {
        whereClause = whereClause.substring(0, whereClause.length - 4);
   }

    var query = `
      WITH Available AS (
        SELECT IP.ingrID
        FROM IngrPrices IP
        WHERE ${whereClause} OR IP.isHousehold = 1
      )
      SELECT R.rID, R.title, R.rating, R.recipe_descr, R.ingr_descr
      FROM Recipe R INNER JOIN RIngredients RI INNER JOIN IngrPrices IP ON R.rID = RI.rID AND RI.ingrID = IP.ingrID
      WHERE NOT EXISTS (
        SELECT RI.ingrID
        FROM RIngredients RI LEFT OUTER JOIN Available A ON RI.ingrID = A.ingrID
        WHERE RI.rID = R.rID AND A.ingrID IS NULL
      )
      GROUP BY R.rID
      ORDER BY COUNT(IP.ingrID) - SUM(IP.isHousehold) DESC, R.rating DESC
      LIMIT 10
    ;`;


  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

  connection.end();
};


function getBudgetRecipes(req, res) {
  var connection = getDBConnect();
  var values = req.query;

  var whereClause = "";

  for (var key in values) {
    if (values.hasOwnProperty(key)) {
        if (values.hasOwnProperty(key))
        {
            whereClause += "IP.ingrID = " + values[key] + " OR ";
        }
    }
  }

  if (whereClause.substring(whereClause.length - 4) == " OR ") {
        whereClause = whereClause.substring(0, whereClause.length - 4);
   }

    var query = `
      WITH Available AS (
        SELECT IP.ingrID
        FROM IngrPrices IP
        WHERE ${whereClause} OR IP.isHousehold = 1
      ), ValidRecipes AS (
        SELECT R.rID, R.title, R.rating, R.recipe_descr, R.ingr_descr
        FROM Recipe R 
        WHERE NOT EXISTS (
          SELECT RI.ingrID
          FROM RIngredients RI LEFT OUTER JOIN Available A ON RI.ingrID = A.ingrID
          WHERE RI.rID = R.rID AND A.ingrID IS NULL
        )
        GROUP BY R.rID
      )
      SELECT DISTINCT VR.title, SUM(IP.price) as recipe_cost, VR.rating, VR.recipe_descr, VR.ingr_descr
      FROM RIngredients RI INNER JOIN IngrPrices IP INNER JOIN ValidRecipes VR ON RI.ingrID = IP.ingrID AND VR.rID = RI.rID
      GROUP BY VR.rID
      HAVING recipe_cost > 0
      ORDER BY recipe_cost, COUNT(IP.ingrID) - SUM(IP.isHousehold) DESC, VR.rating DESC
      LIMIT 10
    ;`;


  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

  connection.end();
};

function getClosestIngr(req, res) {
  var connection = getDBConnect();
  var values = req.query;

  var whereClause = "";

  for (var key in values) {
    if (values.hasOwnProperty(key)) {
        if (values.hasOwnProperty(key))
        {
            whereClause += "IP.ingrID = " + values[key] + " OR ";
        }
    }
  }

  if (whereClause.substring(whereClause.length - 4) == " OR ") {
        whereClause = whereClause.substring(0, whereClause.length - 4);
   }

    var query = `
      WITH Available AS (
            SELECT IP.ingrID
            FROM IngrPrices IP
            WHERE ${whereClause} OR IP.isHousehold = 1
      ), RecipeToNeededIngr AS (
        SELECT R.rID, IP.ingrID, IP.name
        FROM Recipe R INNER JOIN RIngredients RI INNER JOIN IngrPrices IP ON R.rID = RI.rID AND RI.ingrID = IP.ingrID LEFT OUTER JOIN Available A ON RI.ingrID = A.ingrID
        WHERE A.ingrID IS NULL
        GROUP BY R.rID
        HAVING COUNT(RI.ingrID) = 1
      )
      SELECT RNI.ingrID, RNI.name, COUNT(RNI.rID) AS count
      FROM RecipeToNeededIngr RNI
      GROUP BY RNI.ingrID
      ORDER BY count DESC
      LIMIT 3
    ;`;


  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

  connection.end();
};



/* -------------------------- Login/User Routes --------------------- */
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

//TODO: ADD ERROR HANDLING FOR WHEN USERNAME ALREADY EXISTS
	newPerson.save( (err) => {
		if (err) {
			res.type('html').status(200);
			res.write('uh oh: ' + err);
			console.log(err);
			res.end();
		}
		else {
      console.log("it worked");
      req.session.user=newPerson;
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

//TODO: ADD ERROR HANDLING FOR WHEN PASSWORD IS WRONG
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
        req.session.user=user;
        res.send(JSON.stringify({result: 'p'}));
      }
		}
	});
};

//TODO: ADD ERROR HANDLING FOR WHEN PASSWORD IS WRONG
function returnUser(req, res) {
  if (!req.session) {
    var fakePerson = new Person ({
      username: "test",
      password: "test",
      isVegan: true,
      isVegetarian: false,
      isLactose: true,
      isNut: true,
      isGluten: false,
      weight: 150,
      heightFeet: 5,
      heightInches:  4,
      activityLevel:  "low",
      age:  21
    });
    res.send(JSON.stringify({fakePerson}));
  }
  if(req.session.user === undefined) {
    console.log("probably shouldn't be here")
    var fakePerson = new Person ({
      username: test,
      password: test,
      isVegan: true,
      isVegetarian: false,
      isLactose: true,
      isNut: true,
      isGluten: false,
      weight: 20,
      heightFeet: 11111,
      heightInches:  100,
      activityLevel:  "high",
      age:  99
    });
    res.send(JSON.stringify({fakePerson}));
  }
	res.send(JSON.stringify(req.session.user));
};


/* -------------------------- Dish / Restaurant Routes --------------------- */

function getStates(req, res) {
  var connection = getDBConnect();

  var query = `Select DISTINCT(rest_state) FROM Restaurant`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log("HELLo");
      console.log(rows);
      res.json(rows);
    }
  });
  connection.end();
};

function getCities(req, res) {
  var connection = getDBConnect();
  var state = req.params.state;
  var query = `Select DISTINCT(rest_city) FROM Restaurant WHERE rest_state = '${state}'`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
  connection.end();
};

function getRestaurantsBasic(req, res) {
  var connection = getDBConnect();
  var state = req.params.state;
  var city = req.params.city;
  var query = `SELECT * FROM Restaurant 
               WHERE rest_state = '${state}' AND rest_city = '${city}'
               ORDER BY RAND()
               LIMIT 2`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
  connection.end();
};

function getDishSearch(req, res) {
  var connection = getDBConnect();
  var state = req.params.state;
  var city = req.params.city;
  var search = req.params.search;

  var query = `WITH nearby_restaurants AS (SELECT * FROM Restaurant WHERE rest_state = '${state}')
                SELECT *
                FROM Dish d JOIN Serves s ON s.dish_id = d.dish_id JOIN nearby_restaurants r ON r.rest_id = s.rest_id
                WHERE REGEXP_LIKE(d.dish_name, '${search}')
                LIMIT 10`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
  connection.end();
};

function getRecommendedRecipes(req, res) {
  var connection = getDBConnect();
  var recipeID = req.params.rID;
  var query = `WITH InputIngr AS (
      SELECT ingrID
      FROM RIngredients 
      WHERE rID = '${recipeID}'
    ),
    InputCats AS (
      SELECT category
      FROM RCategories 
      WHERE rID =  '${recipeID}'
    ),
    Similar AS (
      SELECT ingr.rID, COUNT(DISTINCT ingr.ingrID) AS ingrCount, COUNT(DISTINCT c.category) AS catCount
      FROM (RIngredients ingr JOIN InputIngr inputI ON ingr.ingrID = inputI.ingrID)
        JOIN 
          (RCategories c JOIN InputCats inputC ON c.category = inputC.category)
         ON ingr.rID = c.rID
      GROUP BY ingr.rID
    )
    SELECT r.rID, r.title, r.ingr_descr, r.directions, r.rating, ingr_descr
    FROM Similar JOIN Recipe r ON Similar.rID = r.rID
    WHERE ingrCount > 1/2 * (SELECT COUNT(*)
          FROM InputIngr)
      AND r.rID <>  '${recipeID}'
    ORDER BY catCount DESC, ingrCount DESC, rating DESC
    LIMIT 5;`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
  connection.end();
};

function getFullRecipe(req, res) {
  var connection = getDBConnect();
  var rID = req.params.rID;

  var query = `SELECT * FROM Recipe WHERE rID = '${rID}';`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
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
  getValRecipes: getValRecipes,
  getBudgetRecipes: getBudgetRecipes,
  getClosestIngr: getClosestIngr,
  signupUser: signupUser,
  loginUser: loginUser,
  returnUser: returnUser,
  getStates: getStates,
  getCities: getCities,
  getRestaurantsBasic: getRestaurantsBasic,
  getDishSearch: getDishSearch,
  getRecommendedRecipes: getRecommendedRecipes,
  getFullRecipe: getFullRecipe 
}
