import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import NutritionSearch from './components/NutritionSearch';
import BudgetSearch from './components/BudgetSearch';
import IngrSearch from './components/IngrSearch';
import DishSearch from './components/DishSearch';
import Login from './components/Login';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<Login/>
							)}
						/>
						<Route
							exact
							path="/Login"
							render={() => (
								<Login/>
							)}
						/>
						<Route
							exact
							path="/Ingredient Search"
							render={() => (
								<IngrSearch />
							)}
						/>
						<Route
							exact
							path="/Budget Search"
							render={() => (
								<BudgetSearch />
							)}
						/>
						<Route
							exact
							path="/Dish Search"
							render={() => (
								<DishSearch />
							)}
						/>
						<Route
							exact
							path="/Nutrition Search"
							render={() => (
								<NutritionSearch />
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}