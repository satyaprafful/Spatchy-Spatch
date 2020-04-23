import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RecipeRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="recipeResults">
				<div className="title">{this.props.title}</div>
			</div>
		);
	}
}
