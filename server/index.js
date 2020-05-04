const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var currentUser = null;
/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- Nutrition Queries ---- */
// sends min protein/cal, gets back recipes
app.get('/protein/:proteinRatio/:isVegan/:isNutFree/:isDairyFree/:isVegetarian/:isGlutenFree', (req, res) => { 
	routes.getHighProtein(req,res)}
); 

// sends min fat/cal, gets back recipes
app.get('/nutrition/fat/:fatRatio/:isVegan/:isNutFree/:isDairyFree/:isVegetarian/:isGlutenFree', (req, res) => { 
	routes.getHighFat(req,res)}
); 

// sends max sodium, gets back recipes
app.get('/nutrition/sodium/:sodiumLimit/:isVegan/:isNutFree/:isDairyFree/:isVegetarian/:isGlutenFree', (req, res) => { 
	routes.getLowSodium(req,res)}
); 

// sends max cal, gets back recipes
app.get('/nutrition/cal/:calLimit/:isVegan/:isNutFree/:isDairyFree/:isVegetarian/:isGlutenFree', (req, res) => { 
	routes.getLowCal(req,res)}
);

/* ---- Ingredient Queries ---- */
app.get('/ingredients/:isVegan/:isNutFree/:isDairyFree/:isVegetarian/:isGlutenFree/', (req, res) => {
	routes.getValRecipes(req,res)}
);

app.get('/budget/:isVegan/:isNutFree/:isDairyFree/:isVegetarian/:isGlutenFree/', (req, res) => {
	routes.getBudgetRecipes(req,res)}
);

app.get('/recipe/full/:rID', (req, res) => {
	routes.getFullRecipe(req,res)}
);
app.get('/recipe/recommend/:rID/:isVegan/:isNutFree/:isDairyFree/:isVegetarian/:isGlutenFree', (req, res) => {
	routes.getRecommendedRecipes(req,res)}
);

app.get('/quickadd/', (req, res) => {
	routes.getClosestIngr(req,res)}
);

/* ---- User Routes ---- */
app.post('/signup', (req, res) => {
	routes.signupUser(req, res)}
);

app.post('/login', (req, res) => {
	routes.loginUser(req, res)}
);

app.get('/curruser', (req, res) => {
	routes.returnUser(req, res)}
);

app.post('/edituser', (req, res) => {
	routes.editUser(req, res)}
);

/* ---- Dishes/Restaurant Queries ---- */
app.get('/states/', (req, res) => {
	routes.getStates(req,res)}
);

app.get('/cities/:state', (req, res) => {
	routes.getCities(req,res)}
);

app.get('/restaurants/:state/:city', (req, res) => {
	routes.getRestaurantsBasic(req,res)}
);

app.get('/dishes/:state/:city/:search', (req, res) => {
	routes.getDishSearch(req,res)}
);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});












