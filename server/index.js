const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- Nutrition Queries ---- */
// sends min protein/cal, gets back recipes
app.get('/protein/:proteinRatio/:isVegan/:isNutFree/:isDairyFree/:isVegetarian/:isGlutenFree', (req, res) => { 
	routes.getHighProtein(req,res)}
); 

// sends min fat/cal, gets back recipes
app.get('/nutrition/fat/:fatRaio', (req, res) => { 
	routes.getHighFat(req,res)}
); 

// sends max sodium, gets back recipes
app.get('/nutrition/sodium/:sodiumLimit', (req, res) => { 
	routes.getLowSodium(req,res)}
); 

// sends max cal, gets back recipes
app.get('/nutrition/cal/:calLimit', (req, res) => { 
	routes.getLowCal(req,res)}
);

/* ---- Ingredient Queries ---- */
app.get('/ingredients/', (req, res) => {
	routes.getValRecipes(req,res)}
);

app.get('/budget/', (req, res) => {
	routes.getBudgetRecipes(req,res)}
);

app.get('/recipe/full/:rID', (req, res) => {
	routes.getFullRecipe(req,res)}
);
app.get('/recipe/recommend/:rID', (req, res) => {
	routes.getRecommendedRecipes(req,res)}
);

app.get('/quickadd/', (req, res) => {
	routes.getClosestIngr(req,res)}
);

/* ---- Login Routes ---- */
app.post('/signup', (req, res) => {
	routes.signupUser(req, res)}
);

app.post('/login', (req, res) => {
	routes.loginUser(req, res)}
);

app.get('/curruser', (req, res) => {
	routes.returnUser(req, res)}
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












