import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import ExactRecipes from './components/ExactRecipes';
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
							path="/exactrecipes"
							render={() => (
								<ExactRecipes />
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}