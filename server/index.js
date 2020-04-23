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


/* ---- test route ---- */
app.get('/dishes', routes.dishName); 

/* ---- Nutrition Queries ---- */
// sends min protein/cal, gets back recipes
app.get('/protein/:proteinRatio', (req, res) => { 
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



app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});












