import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import RecipeRow from './RecipeRow';


export default class IngrSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        ingrList: "",
        recRecipes: []
    }

    this.handleIngrIDChange = this.handleIngrIDChange.bind(this);
    this.submitIngr = this.submitIngr.bind(this);

	}

	handleIngrIDChange(e) {
		this.setState({
			ingrList: e.target.value
		});

    }

  getIngrList()
  {
    var ingr1 = 1;
    var ingr2 = 2;
    var ingr3 = 3;
    var ingr4 = 4;
    var ingr5 = 5;

    return "${ingr1}&${ingr2}&${ingr3}&${ingr4}&${ingr5}";
  }

  parseIngrList()
  {
    var ingrList = this.state.ingrList;
    var sList = ingrList.split(", ");

    var output = "?" + "ingr0=" + sList[0];


    for (var i = 1; i < sList.length; i++) {
      output += "&ingr" + i + "=" + sList[i];
    }

    return output;
  }

  submitIngr()
  {
    fetch("http://localhost:8081/ingredients/" + this.parseIngrList(),
      {
        method: "GET"
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(recipesList => {

        console.log(recipesList); //delete this

        let recipesDiv = recipesList.map((recipeObj, i) =>
          <RecipeRow title = {recipeObj.name} />
        );


        ///This saves our HTML representation of the data into the state, which we can call in our render function
        this.setState({
          recRecipes : recipesDiv
        });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });
  }

  render() {
    return (
      <div className="IngrSearch">

        <PageNavbar active="Ingredient based searching" />
        <br></br>
        This is the ingredient page
      </div>
    );
  }

  render() {

		return (
			<div className="IngrSearch">
				<PageNavbar active="Ingredient based searching" />

			    <div className="container ingredients-container">
			    	<div className="jumbotron">
			    		<div className="h5">IngrSearch</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter 5 ingredient IDs, separated by commas" value={this.state.ingrList} onChange={this.handleIngrIDChange} id="ingrList" className="ingr-input"/>
			    			<button id="submitBtn" className="submit-btn" onClick={this.submitIngr}>Submit</button>
			    		</div>
			    		<div className="header-container">
			    			<div className="h6">Here are some suggested recipes ...</div>
			    			<div className="headers">
			    				<div className="header"><strong>Title</strong></div>
			    			</div>
			    		</div>
			    		<div className="results-container" id="results">
			    			{this.state.recRecipes}
			    		</div>
			    	</div>
			    </div>
		    </div>
		);
	}

}