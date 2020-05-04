var mysql = require('mysql');
var Person = require('./models/person.js');
const mongoose = require('mongoose');


/*  put this in a function bc right now being janky and connecting
  * to the DB before each query and ending the connection after.
  * Should figure out better way, instead, to close connections.
  */
function getDBConnect() {
  var connection = mysql.createConnection({
    host: 'database2.calom4x7svhj.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'admin123',
    port: 3306,
    database: 'database2',
    insecureAuth: true
  });

  connection.connect(function (err) {
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
  var isVegan = req.params.isVegan;
  var isNutFree = req.params.isNutFree;
  var isDairyFree = req.params.isDairyFree;
  var isVegetarian = req.params.isVegetarian;
  var isGlutenFree = req.params.isGlutenFree;

  var query = `
  WITH Eatable AS (
    SELECT R.rID 
    FROM (IngrDiet D JOIN RIngredients I ON D.ingrID = I.ingrID)
        JOIN Recipe R ON R.RID = I.RID
    GROUP BY R.RID
    HAVING SUM(D.isVegan) >= COUNT(*) * '${isVegan}' AND 
          SUM(D.isNutFree) >= COUNT(*) * '${isNutFree}' AND
          SUM(D.isDairyFree) >= COUNT(*) * '${isDairyFree}' AND
          SUM(D.isVegetarian) >= COUNT(*) * '${isVegetarian}' AND
          SUM(D.isGlutenFree) >= COUNT(*) * '${isGlutenFree}' 
  )
  SELECT *
  FROM Recipe R
  WHERE R.protein/(R.calories + 1) >= '${inputRatio}' AND R.protein >= 5 
      AND R.rID in (SELECT * FROM Eatable)
  ORDER BY R.rating DESC
  LIMIT 10`;

  connection.query(query, function (err, rows, fields) {
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
  var isVegan = req.params.isVegan;
  var isNutFree = req.params.isNutFree;
  var isDairyFree = req.params.isDairyFree;
  var isVegetarian = req.params.isVegetarian;
  var isGlutenFree = req.params.isGlutenFree;

  var query = `
  WITH Eatable AS (
    SELECT R.rID 
    FROM (IngrDiet D JOIN RIngredients I ON D.ingrID = I.ingrID)
        JOIN Recipe R ON R.RID = I.RID
    GROUP BY R.RID
    HAVING SUM(D.isVegan) >= COUNT(*) * '${isVegan}' AND 
          SUM(D.isNutFree) >= COUNT(*) * '${isNutFree}' AND
          SUM(D.isDairyFree) >= COUNT(*) * '${isDairyFree}' AND
          SUM(D.isVegetarian) >= COUNT(*) * '${isVegetarian}' AND
          SUM(D.isGlutenFree) >= COUNT(*) * '${isGlutenFree}' 
  )
  SELECT *
  FROM Recipe R
  WHERE R.fat/(R.calories + 1) >= '${inputRatio}'
  AND R.rID IN (SELECT * FROM Eatable)
  ORDER BY R.rating DESC
  LIMIT 10`;

  connection.query(query, function (err, rows, fields) {
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
  var isVegan = req.params.isVegan;
  var isNutFree = req.params.isNutFree;
  var isDairyFree = req.params.isDairyFree;
  var isVegetarian = req.params.isVegetarian;
  var isGlutenFree = req.params.isGlutenFree;

  var query = `
  WITH Eatable AS (
    SELECT R.rID 
    FROM (IngrDiet D JOIN RIngredients I ON D.ingrID = I.ingrID)
        JOIN Recipe R ON R.RID = I.RID
    GROUP BY R.RID
    HAVING SUM(D.isVegan) >= COUNT(*) * '${isVegan}' AND 
          SUM(D.isNutFree) >= COUNT(*) * '${isNutFree}' AND
          SUM(D.isDairyFree) >= COUNT(*) * '${isDairyFree}' AND
          SUM(D.isVegetarian) >= COUNT(*) * '${isVegetarian}' AND
          SUM(D.isGlutenFree) >= COUNT(*) * '${isGlutenFree}' 
  )
  SELECT * 
  FROM Recipe R
  WHERE R.sodium < '${limit}'
    AND R.rID IN (SELECT * FROM Eatable)
  ORDER BY R.rating DESC
  LIMIT 10`;

  connection.query(query, function (err, rows, fields) {
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
  var isVegan = req.params.isVegan;
  var isNutFree = req.params.isNutFree;
  var isDairyFree = req.params.isDairyFree;
  var isVegetarian = req.params.isVegetarian;
  var isGlutenFree = req.params.isGlutenFree;

  var query = `
  WITH Eatable AS (
    SELECT R.rID 
    FROM (IngrDiet D JOIN RIngredients I ON D.ingrID = I.ingrID)
        JOIN Recipe R ON R.RID = I.RID
    GROUP BY R.RID
    HAVING SUM(D.isVegan) >= COUNT(*) * '${isVegan}' AND 
          SUM(D.isNutFree) >= COUNT(*) * '${isNutFree}' AND
          SUM(D.isDairyFree) >= COUNT(*) * '${isDairyFree}' AND
          SUM(D.isVegetarian) >= COUNT(*) * '${isVegetarian}' AND
          SUM(D.isGlutenFree) >= COUNT(*) * '${isGlutenFree}' 
  )
  SELECT * 
  FROM Recipe R
  WHERE R.calories < '${limit}' AND R.calories > 100
      AND R.rID IN (SELECT * FROM Eatable)
  ORDER BY R.rating DESC
  LIMIT 10`;

  connection.query(query, function (err, rows, fields) {
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
  var isVegan = req.params.isVegan;
  var isNutFree = req.params.isNutFree;
  var isDairyFree = req.params.isDairyFree;
  var isVegetarian = req.params.isVegetarian;
  var isGlutenFree = req.params.isGlutenFree;

  var whereClause = "";

  for (var key in values) {
    if (values.hasOwnProperty(key)) {
      if (values.hasOwnProperty(key)) {
        whereClause += "IP.ingrID = " + values[key] + " OR ";
      }
    }
  }

  if (whereClause.substring(whereClause.length - 4) == " OR ") {
    whereClause = whereClause.substring(0, whereClause.length - 4);
  }
  console.log(whereClause);

  var query = `
      WITH Available AS (
        SELECT IP.ingrID
        FROM IngrPrices IP
        WHERE ${whereClause} OR IP.isHousehold = 1
      ),Eatable AS (
        SELECT R.rID 
        FROM (IngrDiet D JOIN RIngredients I ON D.ingrID = I.ingrID)
            JOIN Recipe R ON R.RID = I.RID
        GROUP BY R.RID
        HAVING SUM(D.isVegan) >= COUNT(*) * '${isVegan}' AND 
              SUM(D.isNutFree) >= COUNT(*) * '${isNutFree}' AND
              SUM(D.isDairyFree) >= COUNT(*) * '${isDairyFree}' AND
              SUM(D.isVegetarian) >= COUNT(*) * '${isVegetarian}' AND
              SUM(D.isGlutenFree) >= COUNT(*) * '${isGlutenFree}' 
      )
      SELECT R.rID, R.title, R.rating, R.recipe_descr, R.ingr_descr
      FROM Recipe R INNER JOIN RIngredients RI INNER JOIN IngrPrices IP ON R.rID = RI.rID AND RI.ingrID = IP.ingrID
      WHERE R.rID IN (SELECT * FROM Eatable)
        AND NOT EXISTS (
        SELECT RI.ingrID
        FROM RIngredients RI LEFT OUTER JOIN Available A ON RI.ingrID = A.ingrID
        WHERE RI.rID = R.rID AND A.ingrID IS NULL
      )
      GROUP BY R.rID
      ORDER BY COUNT(IP.ingrID) - SUM(IP.isHousehold) DESC, R.rating DESC;
    ;`;


  connection.query(query, function (err, rows, fields) {
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
  var isVegan = req.params.isVegan;
  var isNutFree = req.params.isNutFree;
  var isDairyFree = req.params.isDairyFree;
  var isVegetarian = req.params.isVegetarian;
  var isGlutenFree = req.params.isGlutenFree;

  var whereClause = "";

  for (var key in values) {
    if (values.hasOwnProperty(key)) {
      if (values.hasOwnProperty(key)) {
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
      ),Eatable AS (
        SELECT R.rID 
        FROM (IngrDiet D JOIN RIngredients I ON D.ingrID = I.ingrID)
            JOIN Recipe R ON R.RID = I.RID
        GROUP BY R.RID
        HAVING SUM(D.isVegan) >= COUNT(*) * '${isVegan}' AND 
              SUM(D.isNutFree) >= COUNT(*) * '${isNutFree}' AND
              SUM(D.isDairyFree) >= COUNT(*) * '${isDairyFree}' AND
              SUM(D.isVegetarian) >= COUNT(*) * '${isVegetarian}' AND
              SUM(D.isGlutenFree) >= COUNT(*) * '${isGlutenFree}' 
      ),
       ValidRecipes AS (
        SELECT R.rID, R.title, R.rating, R.recipe_descr, R.ingr_descr
        FROM Recipe R 
        WHERE R.rID in (SELECT * FROM Eatable)
          AND NOT EXISTS (
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
    ;`;


  connection.query(query, function (err, rows, fields) {
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
      if (values.hasOwnProperty(key)) {
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


  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

  connection.end();
};



/* -------------------------- Login/User Routes --------------------- */
function signupUser(req, res) {
  Person.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      res.write('uh oh: ' + err);
      console.log(err);
      res.end();
    }
    else {
      if (!user) {
        var newPerson = new Person({
          username: req.body.username,
          password: req.body.password,
          isVegan: req.body.isVegan,
          isVegetarian: req.body.isVegetarian,
          isLactose: req.body.isLactose,
          isNut: req.body.isNut,
          isGluten: req.body.isGluten,
          weight: req.body.weight,
          heightFeet: req.body.heightFeet,
          heightInches: req.body.heightInches,
          activityLevel: req.body.activityLevel,
          age: req.body.age,
          city: req.city,
          state: req.state
        });
        newPerson.save((err) => {
          if (err) {
            res.write('uh oh: ' + err);
            console.log(err);
            res.end();
          }
          else {
            console.log("it worked");
            currentUser = newPerson;
            console.log(newPerson);
            res.send(JSON.stringify({ result: 'p' }))
          }
        });
      } else {
        res.send(JSON.stringify({ result: 'f' }))
      }
    }
  });

};

function loginUser(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  Person.findOne({ username: username }, function (err, user) {
    if (err) {
      res.type('html').status(200);
      res.write('uh oh: ' + err);
      console.log(err);
      res.end();
    }
    else {
      if (!user) {
        res.send(JSON.stringify({ result: 'f' }));
      } else {
        if (user.password !== password) {
          res.send(JSON.stringify({ result: 'f' }));
        } else {
          console.log(user);
          currentUser = user;
          res.send(JSON.stringify({ result: 'p' }));
        }
      }
    }
  });
};

function returnUser(req, res) {
  if (!currentUser) {
    currentUser = new Person({
      username: "test",
      password: "test",
      isVegan: true,
      isVegetarian: false,
      isLactose: true,
      isNut: true,
      isGluten: false,
      weight: 150,
      heightFeet: 5,
      heightInches: 4,
      activityLevel: "low",
      age: 21
    });
    res.send(JSON.stringify(currentUser));
  } else {
    res.send(JSON.stringify(currentUser));
  }
};

function editUser(req, res) {
  console.log(req)
  Person.findOneAndUpdate({ username: currentUser.username }, {
    $set: {
      isVegan: req.body.isVegan,
      isVegetarian: req.body.isVegetarian,
      isLactose: req.body.isLactose,
      isNut: req.body.isNut,
      isGluten: req.body.isGluten,
      weight: req.body.weight,
      heightFeet: req.body.heightFeet,
      heightInches: req.body.heightInches,
      activityLevel: req.body.activityLevel,
      age: req.body.age,
      city: req.body.city,
      state: req.body.state
    }}, {new: true}, function(err, newUser) {
      if(err) {
        console.log("uh oh");
      } else {
        currentUser = newUser;
        res.send(currentUser);
      }
    }
  );
};


/* -------------------------- Dish / Restaurant Routes --------------------- */

function getStates(req, res) {
  var connection = getDBConnect();

  var query = `Select DISTINCT(rest_state) FROM Restaurant`;

  connection.query(query, function (err, rows, fields) {
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

  connection.query(query, function (err, rows, fields) {
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

  connection.query(query, function (err, rows, fields) {
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

  connection.query(query, function (err, rows, fields) {
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
  var isVegan = req.params.isVegan;
  var isNutFree = req.params.isNutFree;
  var isDairyFree = req.params.isDairyFree;
  var isVegetarian = req.params.isVegetarian;
  var isGlutenFree = req.params.isGlutenFree;

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
    EatableIngr AS (
      SELECT r.ingrID, r.rID
      FROM IngrDiet D JOIN RIngredients r ON D.ingrID = r.ingrID
      WHERE D.isVegan >= '${isVegan}' AND 
            D.isNutFree >= '${isNutFree}' AND
            D.isDairyFree >= '${isDairyFree}' AND
            D.isVegetarian >= '${isVegetarian}' AND
            D.isGlutenFree >= '${isGlutenFree}'
    ),
    Similar AS (
      SELECT e.rID, COUNT(e.ingrID) AS ingrCount, COUNT(c.category) AS catCount
      FROM (EatableIngr e JOIN InputIngr inputI ON e.ingrID = inputI.ingrID) 
        JOIN 
          (RCategories c USE INDEX(cat_rid) JOIN InputCats inputC ON c.category = inputC.category)
         ON e.rID = c.rID
      WHERE e.rID <>  '${recipeID}'
      GROUP BY e.rID
    )
    SELECT r.rID, r.title, r.ingr_descr, r.directions, r.rating, ingr_descr
    FROM Similar JOIN Recipe r ON Similar.rID = r.rID
    WHERE ingrCount > 1/2 * (SELECT COUNT(*)
                              FROM InputIngr)
    ORDER BY catCount DESC, ingrCount DESC, rating DESC
    LIMIT 5;`;

  connection.query(query, function (err, rows, fields) {
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

  connection.query(query, function (err, rows, fields) {
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
  editUser: editUser,
  getStates: getStates,
  getCities: getCities,
  getRestaurantsBasic: getRestaurantsBasic,
  getDishSearch: getDishSearch,
  getRecommendedRecipes: getRecommendedRecipes,
  getFullRecipe: getFullRecipe
}
